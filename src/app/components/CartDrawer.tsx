"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { useCart, type CartItem } from "../context/CartContext";
import styles from "./components.module.css";
import { QRPaymentScreen } from "./QRPaymentScreen";

type CheckoutStep = "cart" | "qr" | "success" | "invoice-error";
type CheckoutStatus = "idle" | "creating-order" | "creating-invoice";

type DeliveryMethod = "online" | "ship-code" | "ship-disk";

type CustomerForm = {
  name: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  shippingAddress: string;
};

const deliveryOptions: Array<{
  value: DeliveryMethod;
  label: string;
  description: string;
}> = [
  {
    value: "online",
    label: "Kích hoạt online",
    description: "Nhận key và hướng dẫn ngay qua email sau khi thanh toán.",
  },
  {
    value: "ship-code",
    label: "Ship mã bản quyền",
    description: "Gửi key in sẵn đến địa chỉ khách hàng khi cần bàn giao vật lý.",
  },
  {
    value: "ship-disk",
    label: "Ship đĩa cứng",
    description: "Phù hợp đơn cần bộ cài hoặc bàn giao tận nơi cho doanh nghiệp.",
  },
];

const initialCustomerForm: CustomerForm = {
  name: "",
  email: "",
  phone: "",
  deliveryMethod: "online",
  shippingAddress: "",
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);
}

function getActivationDurationLabel(duration: "lifetime" | "yearly") {
  return duration === "yearly" ? "12 tháng" : "Vĩnh viễn";
}

function getAllowedDeliveryMethods(cart: CartItem[]) {
  if (cart.length === 0) return deliveryOptions.map((option) => option.value);

  return deliveryOptions
    .filter((option) =>
      cart.every((item) => item.product.supportedDeliveryMethods?.includes(option.value) ?? true)
    )
    .map((option) => option.value);
}

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    clearCart,
    resetSignal,
  } = useCart();

  const [customerForm, setCustomerForm] = useState<CustomerForm>(initialCustomerForm);
  const [validationError, setValidationError] = useState("");
  const [orderId, setOrderId] = useState<number | null>(null);
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [status, setStatus] = useState<CheckoutStatus>("idle");
  const [qrData, setQrData] = useState<{ qrImage: string; amount: number; orderId: number } | null>(null);

  const busy = status !== "idle";
  const submittingRef = useRef(false);

  const { userId } = useAuth();

  const allowedDeliveryMethods = useMemo(() => getAllowedDeliveryMethods(cart), [cart]);
  const requiresShippingAddress = customerForm.deliveryMethod !== "online";
  const hasYearlyPackage = cart.some((item) => item.product.activationDuration === "yearly");

  const updateCustomerField = <K extends keyof CustomerForm>(field: K, value: CustomerForm[K]) => {
    setCustomerForm((current) => ({ ...current, [field]: value }));
    setValidationError("");
  };

  // Reset checkout state when the cart is force-reset (e.g. on sign-out). Adjusting
  // state during render, guarded by the previously-seen signal, is React's recommended
  // pattern for "reset when a value changes" and avoids cascading effects.
  const [seenResetSignal, setSeenResetSignal] = useState(resetSignal);
  if (resetSignal !== seenResetSignal) {
    setSeenResetSignal(resetSignal);
    setStep("cart");
    setStatus("idle");
    setOrderId(null);
    setQrData(null);
    setValidationError("");
    setCustomerForm(initialCustomerForm);
  }

  // Starting a new shopping session (empty -> non-empty) must never reuse anything
  // from a previous checkout: no stale step/result screen, and above all no stale
  // orderId/qrData — otherwise "Thanh toán ngay" would resume the OLD order's
  // payment instead of creating a new order for the new cart.
  const [seenCartLen, setSeenCartLen] = useState(cart.length);
  if (cart.length !== seenCartLen) {
    const wasEmpty = seenCartLen === 0;
    setSeenCartLen(cart.length);
    if (wasEmpty && cart.length > 0 && (orderId != null || step !== "cart")) {
      // After a completed purchase the next order starts completely fresh,
      // including the customer form.
      if (step === "success") {
        setCustomerForm(initialCustomerForm);
      }
      setStep("cart");
      setOrderId(null);
      setQrData(null);
      setValidationError("");
    }
  }

  // Drawer accessibility: lock body scroll, close on Escape, manage focus.
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusedRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (!isCartOpen) return;
    lastFocusedRef.current = (document.activeElement as HTMLElement) ?? null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus({ preventScroll: true }), 60);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsCartOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      lastFocusedRef.current?.focus?.();
    };
  }, [isCartOpen, setIsCartOpen]);

  // Step 2 (idempotent): create/resume the QR invoice for an EXISTING order.
  const createInvoice = async (targetOrderId: number) => {
    setStatus("creating-invoice");
    try {
      const invoiceRes = await fetch("/api/payment/create-invoice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: targetOrderId }),
      });
      const invoiceData = await invoiceRes.json().catch(() => ({}));

      if (!invoiceRes.ok || !invoiceData.qrImage) {
        setStatus("idle");
        setStep("invoice-error");
        toast.error(
          `Đơn hàng #${targetOrderId} đã được tạo, nhưng chưa thể khởi tạo mã thanh toán. Bạn có thể thử tạo lại.`
        );
        return;
      }

      setQrData({ qrImage: invoiceData.qrImage, amount: invoiceData.amount, orderId: targetOrderId });
      setStep("qr");
      setStatus("idle");
    } catch (error) {
      console.error(error);
      setStatus("idle");
      setStep("invoice-error");
      toast.error(
        `Đơn hàng #${targetOrderId} đã được tạo, nhưng chưa thể khởi tạo mã thanh toán. Bạn có thể thử tạo lại.`
      );
    }
  };

  const handleCheckout = async () => {
    if (submittingRef.current) return;

    const trimmedName = customerForm.name.trim();
    const trimmedEmail = customerForm.email.trim();
    const trimmedPhone = customerForm.phone.trim();
    const trimmedAddress = customerForm.shippingAddress.trim();

    if (!trimmedName || !trimmedEmail || !trimmedPhone) {
      setValidationError("Vui lòng nhập đầy đủ họ tên, email và số điện thoại trước khi thanh toán.");
      return;
    }
    if (!allowedDeliveryMethods.includes(customerForm.deliveryMethod)) {
      setValidationError("Phương thức bàn giao hiện không áp dụng cho các sản phẩm trong giỏ hàng.");
      return;
    }
    if (requiresShippingAddress && !trimmedAddress) {
      setValidationError("Vui lòng thêm địa chỉ giao hàng khi chọn hình thức ship mã hoặc ship đĩa cứng.");
      return;
    }

    // Guard against double submits (double-click / slow network).
    submittingRef.current = true;
    setValidationError("");

    try {
      // Retry after a partial success reuses the existing order — never creates a new one.
      if (orderId != null) {
        await createInvoice(orderId);
        return;
      }

      setStatus("creating-order");
      const items = cart.map((item) => ({
        product_id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.price,
      }));
      const refCode = localStorage.getItem("referral_code");

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            ...customerForm,
            name: trimmedName,
            email: trimmedEmail,
            phone: trimmedPhone,
            shippingAddress: trimmedAddress,
          },
          items,
          total: cartTotal,
          referral_code: refCode,
          clerk_id: userId ?? undefined,
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        success?: boolean;
        orderId?: number;
        error?: string;
      };

      if (!res.ok || !data.success || !data.orderId) {
        setStatus("idle");
        const message = data.error ?? "Không thể tạo đơn hàng. Vui lòng thử lại.";
        setValidationError(message);
        toast.error("Không thể tạo đơn hàng. Vui lòng thử lại.");
        return;
      }

      // Order accepted → the cart is considered placed. Retry now depends on orderId, not the cart.
      setOrderId(data.orderId);
      clearCart();
      await createInvoice(data.orderId);
    } catch (error) {
      console.error(error);
      setStatus("idle");
      const message = "Có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.";
      setValidationError(message);
      toast.error(message);
    } finally {
      submittingRef.current = false;
    }
  };

  const handleRetryInvoice = async () => {
    if (submittingRef.current || orderId == null) return;
    submittingRef.current = true;
    try {
      await createInvoice(orderId);
    } finally {
      submittingRef.current = false;
    }
  };

  return (
    <>
      <div
        className={`${styles.drawerOverlay} ${isCartOpen ? styles.drawerOverlayOpen : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      <div
        className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng của bạn"
        aria-hidden={!isCartOpen || undefined}
        inert={!isCartOpen}
      >
        <div className={styles.drawerHeader}>
          <h3>
            <ShoppingBag size={20} color="var(--primary-blue)" />
            <span>Giỏ hàng của bạn</span>
          </h3>
          <button
            ref={closeBtnRef}
            className={styles.closeBtn}
            onClick={() => setIsCartOpen(false)}
            aria-label="Đóng giỏ hàng"
          >
            <X size={24} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {step === 'qr' && qrData ? (
            <QRPaymentScreen
              qrImage={qrData.qrImage}
              amount={qrData.amount}
              orderId={qrData.orderId}
              onSuccess={() => {
                setStep('success');
                toast.success(`Đơn hàng #${qrData.orderId} đã được thanh toán thành công!`);
              }}
              onTimeout={() => {
                const timedOutOrderId = qrData.orderId;
                // Drop the expired payment session so the next checkout starts a NEW order.
                setStep('cart');
                setOrderId(null);
                setQrData(null);
                toast('Đã hết thời gian thanh toán', {
                  description: `Đơn hàng #${timedOutOrderId} vẫn được lưu lại, bạn có thể kiểm tra trong Tài khoản.`,
                });
              }}
              onCancel={() => {
                const cancelledOrderId = qrData.orderId;
                // The cancelled payment session must never be reused for the next cart.
                setStep('cart');
                setOrderId(null);
                setQrData(null);
                toast('Đã hủy thanh toán', {
                  description: `Đơn hàng #${cancelledOrderId} đã được đánh dấu hủy thanh toán.`,
                });
              }}
            />
          ) : step === 'success' ? (
            <div className="flex flex-col items-center justify-center p-8 text-center space-y-4" role="status" aria-live="polite">
              <CheckCircle2 size={64} className="text-blue-500" />
              <h2 className="text-2xl font-bold text-gray-900">Thanh toán thành công!</h2>
              <p className="text-gray-600">
                Đơn hàng #{orderId} của bạn đã được thanh toán. Cảm ơn bạn đã mua hàng tại WinKey.
              </p>
              {userId ? (
                <Link
                  href="/tai-khoan/don-hang"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Xem đơn hàng
                </Link>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  Thông tin đơn hàng và hướng dẫn kích hoạt đã được gửi tới email của bạn.
                </p>
              )}
            </div>
          ) : step === 'invoice-error' ? (
            <div className="flex flex-col items-center justify-center p-6 text-center space-y-4" role="status" aria-live="polite">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
                <AlertTriangle size={28} className="text-amber-500" />
              </div>
              <h2 className="text-lg font-bold text-gray-900">
                Đơn hàng #{orderId} đã được tạo
              </h2>
              <p className="text-sm text-gray-600">
                Chúng tôi chưa thể khởi tạo mã thanh toán ngay lúc này. Đơn hàng của bạn vẫn được lưu — bạn có thể thử tạo lại mã thanh toán.
              </p>
              <button
                className="btn-grad w-full"
                style={{ padding: "12px" }}
                onClick={handleRetryInvoice}
                disabled={busy}
                aria-busy={busy}
              >
                {busy ? "Đang tạo mã thanh toán..." : "Thử tạo lại mã thanh toán"}
              </button>
              {userId ? (
                <Link
                  href="/tai-khoan/don-hang"
                  onClick={() => setIsCartOpen(false)}
                  className="text-sm font-semibold text-blue-600 hover:underline"
                >
                  Xem đơn hàng của tôi
                </Link>
              ) : (
                <p className="text-xs text-gray-500">
                  Thông tin đơn hàng đã được gửi tới email của bạn.
                </p>
              )}
            </div>
          ) : cart.length === 0 ? (
            <div className={styles.emptyCart}>
              <ShoppingBag size={48} className={styles.emptyCartIcon} />
              <p>Giỏ hàng của bạn đang trống.</p>
              <button className="btn-grad" style={{ padding: "10px 20px" }} onClick={() => setIsCartOpen(false)}>
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            <>
              {cart.map((item) => (
                <div key={item.product.id} className={styles.cartItem}>
                  <div className={styles.cartItemDetails}>
                    <div className={styles.cartItemName}>{item.product.name}</div>
                    <div className={styles.cartItemPrice}>{formatPrice(item.product.price)}</div>
                    <div
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--color-ash)",
                        marginTop: 6,
                      }}
                    >
                      Thời hạn: {getActivationDurationLabel(item.product.activationDuration ?? "lifetime")}
                    </div>
                    <div className={styles.qtyActions}>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus size={12} />
                      </button>
                      <span className={styles.qtyVal}>{item.quantity}</span>
                      <button className={styles.qtyBtn} onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button className={styles.removeItem} onClick={() => removeFromCart(item.product.id)}>
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}

              <div
                style={{
                  border: "1px solid var(--border-color)",
                  borderRadius: 16,
                  padding: 16,
                  background: "rgba(255,255,255,0.92)",
                  display: "grid",
                  gap: 12,
                }}
              >
                <div style={{ display: "grid", gap: 4 }}>
                  <strong style={{ fontSize: "0.95rem", color: "var(--color-midnight-ink)" }}>
                    Thông tin nhận đơn
                  </strong>
                  <span style={{ fontSize: "0.8rem", color: "var(--color-ash)" }}>
                    Dùng để gửi key, hướng dẫn kích hoạt và hỗ trợ sau bán.
                  </span>
                </div>

                <input
                  value={customerForm.name}
                  onChange={(event) => updateCustomerField("name", event.target.value)}
                  placeholder="Họ và tên khách hàng"
                  style={inputStyle}
                />
                <input
                  value={customerForm.email}
                  onChange={(event) => updateCustomerField("email", event.target.value)}
                  placeholder="Email nhận key và hướng dẫn"
                  style={inputStyle}
                  type="email"
                />
                <input
                  value={customerForm.phone}
                  onChange={(event) => updateCustomerField("phone", event.target.value)}
                  placeholder="Số điện thoại / Zalo"
                  style={inputStyle}
                />

                <div style={{ display: "grid", gap: 8 }}>
                  <strong style={{ fontSize: "0.9rem", color: "var(--color-midnight-ink)" }}>
                    Hình thức bàn giao
                  </strong>
                  <div style={{ display: "grid", gap: 8 }}>
                    {deliveryOptions.map((option) => {
                      const disabled = !allowedDeliveryMethods.includes(option.value);

                      return (
                        <label
                          key={option.value}
                          style={{
                            ...deliveryCardStyle,
                            opacity: disabled ? 0.45 : 1,
                            borderColor:
                              customerForm.deliveryMethod === option.value
                                ? "rgba(37, 99, 235, 0.45)"
                                : "var(--border-color)",
                            background:
                              customerForm.deliveryMethod === option.value
                                ? "rgba(37, 99, 235, 0.06)"
                                : "#fff",
                            cursor: disabled ? "not-allowed" : "pointer",
                          }}
                        >
                          <input
                            checked={customerForm.deliveryMethod === option.value}
                            disabled={disabled}
                            name="delivery-method"
                            onChange={() => updateCustomerField("deliveryMethod", option.value)}
                            type="radio"
                          />
                          <div style={{ display: "grid", gap: 4 }}>
                            <span style={{ fontWeight: 700, color: "var(--color-midnight-ink)" }}>
                              {option.label}
                            </span>
                            <span style={{ fontSize: "0.78rem", color: "var(--color-ash)" }}>
                              {option.description}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {requiresShippingAddress && (
                  <div style={{ display: "grid", gap: 8 }}>
                    <strong
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: "0.9rem",
                        color: "var(--color-midnight-ink)",
                      }}
                    >
                      <MapPin size={16} />
                      Địa chỉ giao hàng
                    </strong>
                    <textarea
                      value={customerForm.shippingAddress}
                      onChange={(event) => updateCustomerField("shippingAddress", event.target.value)}
                      placeholder="Nhập địa chỉ đầy đủ để ship mã bản quyền hoặc đĩa cứng"
                      rows={3}
                      style={{ ...inputStyle, resize: "vertical", minHeight: 86 }}
                    />
                  </div>
                )}

                {hasYearlyPackage && (
                  <div
                    style={{
                      borderRadius: 12,
                      background: "rgba(16, 185, 129, 0.08)",
                      color: "#065f46",
                      padding: 12,
                      fontSize: "0.82rem",
                      lineHeight: 1.6,
                    }}
                  >
                    Các gói theo năm sẽ hiển thị thời hạn kích hoạt 12 tháng và hệ thống sẽ tự gửi email nhắc gia hạn
                    trước khi hết hạn để khách chủ động gia hạn tiếp.
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && step === 'cart' && (
          <div className={styles.drawerFooter}>
            {/* Status region — kept in the (non-scrolling) footer so it is always visible,
                even when the cart list is long. */}
            {validationError ? (
              <div
                role="alert"
                aria-live="assertive"
                style={{
                  borderRadius: 12,
                  background: "rgba(239, 68, 68, 0.08)",
                  color: "#b91c1c",
                  padding: 12,
                  fontSize: "0.82rem",
                  lineHeight: 1.5,
                  marginBottom: 12,
                }}
              >
                {validationError}
              </div>
            ) : null}
            <div className={styles.summaryRow}>
              <span>Tổng cộng:</span>
              <span className={styles.totalVal}>{formatPrice(cartTotal)}</span>
            </div>
            <button
              className={`btn-grad ${styles.checkoutBtn}`}
              onClick={handleCheckout}
              disabled={busy}
              aria-busy={busy}
            >
              <CreditCard size={18} />
              <span>{busy ? "Đang xử lý đơn..." : "Thanh toán ngay"}</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  border: "1px solid var(--border-color)",
  borderRadius: 12,
  padding: "12px 14px",
  background: "#fff",
  color: "var(--color-midnight-ink)",
  outline: "none",
  fontSize: "0.9rem",
};

const deliveryCardStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "16px 1fr",
  alignItems: "start",
  gap: 12,
  border: "1px solid var(--border-color)",
  borderRadius: 14,
  padding: 12,
};

const summaryBlockStyle: React.CSSProperties = {
  border: "1px solid var(--border-color)",
  borderRadius: 16,
  padding: 16,
  display: "grid",
  gap: 10,
  background: "rgba(255,255,255,0.92)",
};

const summaryTitleStyle: React.CSSProperties = {
  fontSize: "0.95rem",
  color: "var(--color-midnight-ink)",
};

const summaryRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 16,
  fontSize: "0.85rem",
  color: "var(--color-ash)",
};

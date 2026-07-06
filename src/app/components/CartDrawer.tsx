"use client";

import React, { useMemo, useState } from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useCart, type CartItem } from "../context/CartContext";
import styles from "./components.module.css";

type DeliveryMethod = "online" | "ship-code" | "ship-disk";

type CustomerForm = {
  name: string;
  email: string;
  phone: string;
  deliveryMethod: DeliveryMethod;
  shippingAddress: string;
};

type CheckoutSummary = {
  customer: CustomerForm;
  items: Array<{
    name: string;
    key: string;
    activationDuration: "lifetime" | "yearly";
    renewalReminder: boolean;
  }>;
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

function generateMockKey() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segment = () =>
    Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");

  return `${segment()}-${segment()}-${segment()}-${segment()}-${segment()}`;
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
  } = useCart();

  const [customerForm, setCustomerForm] = useState<CustomerForm>(initialCustomerForm);
  const [validationError, setValidationError] = useState("");
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutSummary, setCheckoutSummary] = useState<CheckoutSummary | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const allowedDeliveryMethods = useMemo(() => getAllowedDeliveryMethods(cart), [cart]);
  const requiresShippingAddress = customerForm.deliveryMethod !== "online";
  const hasYearlyPackage = cart.some((item) => item.product.activationDuration === "yearly");

  const updateCustomerField = <K extends keyof CustomerForm>(field: K, value: CustomerForm[K]) => {
    setCustomerForm((current) => ({ ...current, [field]: value }));
    setValidationError("");
  };

  const handleCheckout = () => {
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

    setIsCheckingOut(true);

    window.setTimeout(() => {
      const summary: CheckoutSummary = {
        customer: {
          ...customerForm,
          name: trimmedName,
          email: trimmedEmail,
          phone: trimmedPhone,
          shippingAddress: trimmedAddress,
        },
        items: cart.map((item) => ({
          name: item.product.name,
          key: generateMockKey(),
          activationDuration: item.product.activationDuration ?? "lifetime",
          renewalReminder: item.product.renewalReminder ?? false,
        })),
      };

      setCheckoutSummary(summary);
      setIsCheckingOut(false);
      clearCart();
      setCustomerForm(initialCustomerForm);
      setValidationError("");
    }, 1600);
  };

  const handleCloseSuccess = () => {
    setCheckoutSummary(null);
    setCopiedIndex(null);
  };

  const copyToClipboard = async (text: string, index: number) => {
    await navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <>
      <div
        className={`${styles.drawerOverlay} ${isCartOpen ? styles.drawerOverlayOpen : ""}`}
        onClick={() => setIsCartOpen(false)}
      />

      <div className={`${styles.drawer} ${isCartOpen ? styles.drawerOpen : ""}`}>
        <div className={styles.drawerHeader}>
          <h3>
            <ShoppingBag size={20} color="var(--primary-blue)" />
            <span>Giỏ hàng của bạn</span>
          </h3>
          <button className={styles.closeBtn} onClick={() => setIsCartOpen(false)}>
            <X size={24} />
          </button>
        </div>

        <div className={styles.drawerBody}>
          {cart.length === 0 ? (
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

                {validationError ? (
                  <div
                    style={{
                      borderRadius: 12,
                      background: "rgba(239, 68, 68, 0.08)",
                      color: "#b91c1c",
                      padding: 12,
                      fontSize: "0.82rem",
                      lineHeight: 1.5,
                    }}
                  >
                    {validationError}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>

        {cart.length > 0 && (
          <div className={styles.drawerFooter}>
            <div className={styles.summaryRow}>
              <span>Tổng cộng:</span>
              <span className={styles.totalVal}>{formatPrice(cartTotal)}</span>
            </div>
            <button className={`btn-grad ${styles.checkoutBtn}`} onClick={handleCheckout} disabled={isCheckingOut}>
              <CreditCard size={18} />
              <span>{isCheckingOut ? "Đang xử lý đơn..." : "Thanh toán ngay"}</span>
            </button>
          </div>
        )}
      </div>

      {checkoutSummary && (
        <div className={styles.successOverlay}>
          <div
            className={`glass ${styles.successContent}`}
            style={{
              maxWidth: 560,
              textAlign: "left",
              alignItems: "stretch",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <CheckCircle2 size={64} className={styles.successIcon} />
            </div>

            <div style={{ display: "grid", gap: 8, textAlign: "center" }}>
              <h2 style={{ margin: 0, color: "var(--color-midnight-ink)" }}>Thanh toán thành công</h2>
              <p style={{ margin: 0, color: "var(--color-ash)", lineHeight: 1.6 }}>
                Thông tin bàn giao đã được tạo. Bạn có thể copy key ngay hoặc chuyển sang bước giao hàng nếu khách chọn
                nhận mã / đĩa cứng.
              </p>
            </div>

            <div style={summaryBlockStyle}>
              <strong style={summaryTitleStyle}>Thông tin khách hàng</strong>
              <div style={summaryRowStyle}>
                <span>Họ tên</span>
                <strong>{checkoutSummary.customer.name}</strong>
              </div>
              <div style={summaryRowStyle}>
                <span>Email</span>
                <strong>{checkoutSummary.customer.email}</strong>
              </div>
              <div style={summaryRowStyle}>
                <span>Điện thoại</span>
                <strong>{checkoutSummary.customer.phone}</strong>
              </div>
              <div style={summaryRowStyle}>
                <span>Bàn giao</span>
                <strong>{deliveryOptions.find((option) => option.value === checkoutSummary.customer.deliveryMethod)?.label}</strong>
              </div>
              {checkoutSummary.customer.deliveryMethod !== "online" ? (
                <div
                  style={{
                    borderTop: "1px dashed var(--border-color)",
                    paddingTop: 10,
                    display: "grid",
                    gap: 8,
                  }}
                >
                  <strong style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Truck size={16} />
                    Địa chỉ giao hàng
                  </strong>
                  <span style={{ color: "var(--color-ash)", lineHeight: 1.6 }}>
                    {checkoutSummary.customer.shippingAddress}
                  </span>
                </div>
              ) : null}
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              {checkoutSummary.items.map((item, index) => (
                <div key={`${item.name}-${index}`} className={styles.licenseCodeContainer} style={{ margin: 0 }}>
                  <p style={{ fontSize: "0.82rem", color: "var(--muted-text)", margin: "0 0 6px" }}>{item.name}</p>
                  <div className={styles.licenseCode}>{item.key}</div>
                  <div
                    style={{
                      marginTop: 10,
                      display: "grid",
                      gap: 6,
                      fontSize: "0.82rem",
                      color: "var(--color-ash)",
                      lineHeight: 1.55,
                    }}
                  >
                    <span>Thời hạn kích hoạt: {getActivationDurationLabel(item.activationDuration)}</span>
                    {item.renewalReminder ? (
                      <span>Hệ thống sẽ tự gửi email nhắc gia hạn trước ngày hết hạn.</span>
                    ) : (
                      <span>Gói này không phát sinh phí gia hạn định kỳ.</span>
                    )}
                  </div>
                  <button className={styles.copySuccessBtn} onClick={() => copyToClipboard(item.key, index)}>
                    {copiedIndex === index ? (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Check size={14} /> Đã sao chép
                      </span>
                    ) : (
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <Copy size={14} /> Sao chép key
                      </span>
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div
              style={{
                borderRadius: 12,
                background: "rgba(37, 99, 235, 0.06)",
                padding: 14,
                fontSize: "0.82rem",
                color: "var(--color-ash)",
                lineHeight: 1.6,
              }}
            >
              {checkoutSummary.customer.deliveryMethod === "online"
                ? "Hướng dẫn kích hoạt chi tiết sẽ được gửi qua email khách hàng sau khi xác nhận thanh toán."
                : "Đơn đang chờ xử lý giao hàng. Bộ phận vận hành cần đối chiếu địa chỉ và cập nhật trạng thái bàn giao cho khách."}
            </div>

            <button className="btn-grad" style={{ padding: "12px 30px", width: "100%" }} onClick={handleCloseSuccess}>
              Hoàn thành
            </button>
          </div>
        </div>
      )}
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

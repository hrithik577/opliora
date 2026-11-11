/**
 * OPLIORA CONTACT COMPONENT
 * Handles accessible input validation, anti-spam honeypot verification,
 * interactive feedback states, and verified backend delivery via /api/contact.
 */

export class ContactComponent {
  constructor() {
    this.form = document.querySelector("#contactForm");
    this.submitBtn = this.form ? this.form.querySelector(".contact__submit") : null;
    this.statusContainer = document.querySelector("#contactStatus");
    this.categoryPills = document.querySelectorAll(".contact__category-pill");
    this.subjectSelect = document.querySelector("#contactSubject");

    this.init();
  }

  init() {
    if (!this.form) return;

    // 1. Sync category pills with dropdown selection
    if (this.categoryPills.length && this.subjectSelect) {
      this.categoryPills.forEach((pill) => {
        pill.addEventListener("click", () => {
          this.categoryPills.forEach((p) => p.classList.remove("contact__category-pill--active"));
          pill.classList.add("contact__category-pill--active");
          const targetValue = pill.getAttribute("data-category");
          if (targetValue) {
            this.subjectSelect.value = targetValue;
            this.validateField(this.subjectSelect);
          }
        });
      });

      this.subjectSelect.addEventListener("change", (e) => {
        const val = e.target.value;
        this.categoryPills.forEach((pill) => {
          if (pill.getAttribute("data-category") === val) {
            pill.classList.add("contact__category-pill--active");
          } else {
            pill.classList.remove("contact__category-pill--active");
          }
        });
      });
    }

    // 2. Real-time field validation on blur & input
    const inputs = this.form.querySelectorAll("input, select, textarea");
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input));
      input.addEventListener("input", () => {
        if (input.classList.contains("field--error")) {
          this.validateField(input);
        }
      });
    });

    // 3. Form submission
    this.form.addEventListener("submit", (e) => this.handleSubmit(e));
  }

  validateField(field) {
    // Ignore honeypot trap
    if (field.name === "_gotcha_company_trap") return true;

    const value = field.value.trim();
    const errorEl = this.form.querySelector(`[data-error-for="${field.id}"]`);
    let isValid = true;
    let message = "";

    if (field.hasAttribute("required") && !value) {
      isValid = false;
      message = "This field is required.";
    } else if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        message = "Please enter a valid corporate email address.";
      }
    }

    if (!isValid) {
      field.classList.add("field--error");
      field.setAttribute("aria-invalid", "true");
      if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = "block";
      }
    } else {
      field.classList.remove("field--error");
      field.removeAttribute("aria-invalid");
      if (errorEl) {
        errorEl.textContent = "";
        errorEl.style.display = "none";
      }
    }

    return isValid;
  }

  async handleSubmit(e) {
    e.preventDefault();

    // Check anti-spam honeypot
    const honeypot = this.form.querySelector('input[name="_gotcha_company_trap"]');
    if (honeypot && honeypot.value) {
      console.warn("Spam detected via honeypot.");
      return;
    }

    // Validate all required fields
    const inputs = Array.from(this.form.querySelectorAll("input, select, textarea"));
    let formIsValid = true;
    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        formIsValid = false;
      }
    });

    if (!formIsValid) {
      const firstInvalid = this.form.querySelector(".field--error");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // Set UI to loading state
    const originalBtnText = this.submitBtn.innerHTML;
    this.submitBtn.disabled = true;
    this.submitBtn.innerHTML = `
      <span class="btn__spinner"></span>
      <span>Transmitting to Leadership...</span>
    `;

    const formData = {
      name: this.form.querySelector("#contactName")?.value || "",
      email: this.form.querySelector("#contactEmail")?.value || "",
      subject: this.form.querySelector("#contactSubject")?.value || "",
      message: this.form.querySelector("#contactMessage")?.value || "",
      _gotcha_company_trap: honeypot ? honeypot.value : "",
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Backend confirmed SMTP delivery
        this.form.reset();
        this.categoryPills.forEach((p) => p.classList.remove("contact__category-pill--active"));

        this.submitBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          <span>Enquiry Transmitted</span>
        `;
        this.submitBtn.style.background = "linear-gradient(135deg, #20C4E4, #67E6AE)";
        this.submitBtn.style.color = "#0A1628";

        if (this.statusContainer) {
          this.statusContainer.innerHTML = `
            <div class="contact__status contact__status--success">
              <strong>Thank you.</strong> Your corporate communication has been successfully delivered to Opliora Private Limited executive leadership. A response will be dispatched to <strong>${formData.email}</strong>.
            </div>
          `;
          this.statusContainer.style.display = "block";
        }

        setTimeout(() => {
          this.submitBtn.disabled = false;
          this.submitBtn.innerHTML = originalBtnText;
          this.submitBtn.style.background = "";
          this.submitBtn.style.color = "";
        }, 5000);
      } else {
        // Handled server-side response (e.g. SMTP credentials pending or server error)
        this.submitBtn.disabled = false;
        this.submitBtn.innerHTML = originalBtnText;

        const mailtoUrl =
          result.fallbackMailto ||
          `mailto:oplioraprivatelimited@gmail.com?subject=${encodeURIComponent(
            formData.subject
          )}&body=${encodeURIComponent(
            `From: ${formData.name} (${formData.email})\n\n${formData.message}`
          )}`;

        if (this.statusContainer) {
          const isPendingConfig = result.configured === false;
          this.statusContainer.innerHTML = `
            <div class="contact__status contact__status--info" style="background: rgba(32, 196, 228, 0.08); border: 1px solid rgba(32, 196, 228, 0.3); padding: 1.25rem; border-radius: 8px; margin-top: 1.25rem;">
              <p style="margin: 0 0 0.75rem; color: #0A1628; font-size: 0.95rem; font-weight: 600;">
                ${
                  isPendingConfig
                    ? "Gmail SMTP credentials (GMAIL_APP_PASSWORD) are not yet configured on this server."
                    : result.error || "Unable to complete server-side transmission."
                }
              </p>
              <p style="margin: 0 0 1rem; color: #475569; font-size: 0.88rem;">
                Please transmit your communication directly to our corporate inbox:
              </p>
              <a href="${mailtoUrl}" class="btn btn--primary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; padding: 0.65rem 1.4rem; background: #20C4E4; color: #0A1628; border-radius: 50px; font-weight: 700; font-size: 0.88rem;">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <span>Send via Email Client (oplioraprivatelimited@gmail.com)</span>
              </a>
            </div>
          `;
          this.statusContainer.style.display = "block";
        }
      }
    } catch (networkErr) {
      this.submitBtn.disabled = false;
      this.submitBtn.innerHTML = originalBtnText;

      const fallbackMailto = `mailto:oplioraprivatelimited@gmail.com?subject=${encodeURIComponent(
        formData.subject || "Corporate Enquiry"
      )}&body=${encodeURIComponent(
        `From: ${formData.name} (${formData.email})\n\n${formData.message}`
      )}`;

      if (this.statusContainer) {
        this.statusContainer.innerHTML = `
          <div class="contact__status contact__status--info" style="background: rgba(32, 196, 228, 0.08); border: 1px solid rgba(32, 196, 228, 0.3); padding: 1.25rem; border-radius: 8px; margin-top: 1.25rem;">
            <p style="margin: 0 0 0.5rem; color: #0A1628; font-weight: 600;">Direct Communication Channel:</p>
            <p style="margin: 0 0 1rem; color: #475569; font-size: 0.88rem;">Network transmission was interrupted. You can dispatch your message directly to:</p>
            <a href="${fallbackMailto}" class="btn btn--primary" style="display: inline-flex; align-items: center; gap: 0.5rem; text-decoration: none; padding: 0.65rem 1.4rem; background: #20C4E4; color: #0A1628; border-radius: 50px; font-weight: 700; font-size: 0.88rem;">
              <span>Email oplioraprivatelimited@gmail.com</span>
            </a>
          </div>
        `;
        this.statusContainer.style.display = "block";
      }
    }
  }
}

// ------------ GET INPUTS & BUTTON ------------
const nameInput = document.getElementById("name");
const emailInput = document.getElementById("email");
const applyButton = document.querySelector(".clkbtn");


// ------------ VALIDATION FUNCTIONS ------------

// Check if name is valid (only letters & spaces, min 2 characters)
function isValidName(name) {
  const rule = /^[A-Za-z][A-Za-z\s'.-]{1,}$/;  
  return rule.test(name.trim());
}

// Check if email is valid (example: abc@gmail.com)
function isValidEmail(email) {
  const rule = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return rule.test(email.trim());
}

// ------------ ERROR HANDLING ------------

// Show error message below the input
function showError(inputBox, message) {
  let errorBox = inputBox.parentElement.querySelector(".error");

  // If no error div is there, create one
  if (!errorBox) {
    errorBox = document.createElement("div");
    errorBox.className = "error";
    inputBox.parentElement.appendChild(errorBox);
  }

  errorBox.textContent = message;       // show message
  inputBox.classList.add("invalid");    // red highlight
}

// Remove error message
function clearError(inputBox) {
  let errorBox = inputBox.parentElement.querySelector(".error");
  if (errorBox) {
    errorBox.textContent = "";
  }
  inputBox.classList.remove("invalid");
}


// ------------ FIND REQUIRED FIELDS ------------

// Get all inputs where label has a * mark
function getRequiredFields() {
  const fields = Array.from(document.querySelectorAll(".field"));
  const requiredInputs = [];

  fields.forEach(field => {
    const label = field.querySelector("label");
    if (!label) return;

    const hasStar = label.textContent.includes("*") || label.querySelector("span");

    if (hasStar) {
      const input = field.querySelector("input, select, textarea");
      if (input) requiredInputs.push(input);
    }
  });

  return requiredInputs;
}


// ------------ VALIDATE EACH FIELD ------------

function validateField(input) {
  const type = (input.getAttribute("type") || "").toLowerCase();
  const id = (input.id || "").toLowerCase();
  const value = (input.value || "").trim();

  // Check NAME
  if (id === "name") {
    if (!isValidName(value)) {
      showError(input, "Please enter your full name (letters and spaces only).");
      return false;
    }
    clearError(input);
    return true;
  }

  // Check EMAIL
  if (id === "email") {
    if (!isValidEmail(value)) {
      showError(input, "Please enter a valid email address.");
      return false;
    }
    clearError(input);
    return true;
  }

  // Check PHONE NUMBER (id=number or input type=number with phone name)
  if (id === "number" || (type === "number" && /contact|phone|mobile/.test(input.name || ""))) {
    const digits = value.replace(/\D/g, "");
    if (digits.length < 10) {
      showError(input, "Please enter a valid 10-digit mobile number.");
      return false;
    }
    clearError(input);
    return true;
  }

  // Check FILE (resume upload)
  if (type === "file") {
    const files = input.files;
    if (!files || files.length === 0) {
      showError(input, "Please upload your resume.");
      return false;
    }
    clearError(input);
    return true;
  }

  // Check NUMBER type (like age, years of experience)
  if (type === "number") {
    const min = input.getAttribute("min");
    const max = input.getAttribute("max");
    const numValue = Number(value);

    if (value === "" || Number.isNaN(numValue)) {
      showError(input, "This field is required.");
      return false;
    }

    if ((min && numValue < Number(min)) || (max && numValue > Number(max))) {
      showError(input, `Please enter a value between ${min || "-∞"} and ${max || "+∞"}.`);
      return false;
    }

    clearError(input);
    return true;
  }

  // Check SELECT dropdown
  if (input.tagName.toLowerCase() === "select") {
    if (value === "") {
      showError(input, "Please select an option.");
      return false;
    }
    clearError(input);
    return true;
  }

  // Check TEXT/TEXTAREA
  if (value === "") {
    showError(input, "This field is required.");
    return false;
  }

  clearError(input);
  return true;
}


// ------------ VALIDATE WHOLE FORM ------------
function validateForm() {
  const inputs = getRequiredFields();
  let allOkay = true;

  inputs.forEach(input => {
    if (!validateField(input)) {
      allOkay = false;
    }
  });

  return allOkay;
}


// ------------ ATTACH EVENTS (BLUR + CHANGE) ------------
function setEventHandlers() {
  const inputs = getRequiredFields();

  inputs.forEach(input => {
    // When moving out of the field
    input.addEventListener("blur", () => {
      if (input.value.trim() !== "" || input.type === "file") {
        validateField(input);
      }
    });

    // For select dropdown and file inputs
    if (input.tagName.toLowerCase() === "select" || input.type === "file") {
      input.addEventListener("change", () => validateField(input));
    }
  });
}
setEventHandlers();


// ------------ WHEN SUBMIT BUTTON IS CLICKED ------------
applyButton.addEventListener("click", (event) => {
  event.preventDefault();   // stop form submit refresh

  const formOkay = validateForm();

  if (!formOkay) {
    const firstError = document.querySelector(".invalid");
    if (firstError) firstError.focus();
    return;
  }

  // Show success message inside #registerpage
  const container = document.getElementById("registerpage");
  if (container) {
    container.innerHTML = `
      <div class="success-wrap">
        <div class="success-message">
          <div class="success-icon"></div>
          <h2 class="success-title">Thank you for showing interest in Rodeo Digitals.</h2>
          <p class="success-text">We’d like to let you know that your application has been submitted successfully.</p>
          <p class="success-text">If your skills and qualifications match our requirements, we will contact you.</p>
          <div class="success-divider"></div>
          <p class="success-signoff">Thanks & Regards,<br>Team Rodeo Digitals.</p>
          <div class="success-actions">
            <button class="success-btn" id="apply-again">Submit another response</button>
          </div>
        </div>
      </div>
    `;

    // Scroll to top so user sees success
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Reload page when "apply again" is clicked
    const againButton = document.getElementById("apply-again");
    if (againButton) {
      againButton.addEventListener("click", () => window.location.reload());
    }
  }
});

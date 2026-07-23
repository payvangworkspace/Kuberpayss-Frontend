export const validate = async (data, isAdmin) => {
    let validationErrors = {};

    if (!data.user.userId && isAdmin) {
      validationErrors.merchantId = "Merchant is required";
    }

    if (!data.currency.currencyId) {
      validationErrors.currencyCode = "Currency is required";
    }

    if (!data.beneficiaryName) {
      validationErrors.beneficiaryName = "Beneficiary name is required";
    }

    if (!data.beneficiaryContactNumber) {
      validationErrors.beneficiaryContactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(data.beneficiaryContactNumber)) {
      validationErrors.beneficiaryContactNumber =
        "Please enter a valid 10-digit contact number";
    }

    if (!data.beneficiaryEmail) {
      validationErrors.beneficiaryEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(data.beneficiaryEmail)) {
      validationErrors.beneficiaryEmail = "Please enter a valid email address";
    }

    // Bank name 
    if (!data.beneficiaryBankName) {
      validationErrors.beneficiaryBankName = "Bank name is required";
    }

    // Payment type specific validations
    if (data.paymentType === "BANK") {
      if (!data.accountNumber) {
        validationErrors.accountNumber = "Account number is required";
      }
      if (!data.bankCode) {
        validationErrors.bankCode = "Bank code is required";
      }
    } else if (data.paymentType === "UPI") {
      if (!data.vpa) {
        validationErrors.vpa = "UPI ID is required";
      } else if (!/^[\w\.\-]+@[\w\-]+$/.test(data.vpa)) {
        validationErrors.vpa = "Please enter a valid UPI ID";
      }
    }

    return validationErrors;
  };
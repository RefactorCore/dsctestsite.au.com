// --- Tool 1: Company Name Cleaner ---
function cleanName(name) {
  if (!name) return "";
  let cleaned = name;

  // Remove unwanted terms
  const removeList = [
    "Pty Ltd", "NL", "LTC", "Ltd", "LLC", "Co.", "Inc",
    "Corporation", "Company", "Corp.", "Webshop", "®", "Services"
  ];
  removeList.forEach(term => {
    cleaned = cleaned.replace(new RegExp("\\b" + term + "\\b", "gi"), "");
  });

  // Remove country/state codes
  const countryCodes = ["AU", "AUS", "USA", "UK", "CAN"];
  countryCodes.forEach(code => {
    cleaned = cleaned.replace(new RegExp("\\b" + code + "\\b", "gi"), "");
  });

  // Remove www. and .com
  cleaned = cleaned.replace(/www\./gi, "").replace(/\.com/gi, "");

  // Remove accents & hyphens
  cleaned = cleaned.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  cleaned = cleaned.replace(/-/g, " ");

  // Trim extra spaces
  cleaned = cleaned.trim().replace(/\s+/g, " ");

  // Capitalize first letter of each word
  cleaned = cleaned.replace(/\b\w/g, c => c.toUpperCase());

  // Convert to initials if multi-word
  const words = cleaned.split(" ").filter(w => w.length > 0);
  let initials = "";
  if (words.length > 1) {
    initials = words.map(w => w[0].toUpperCase()).join("");
  } else {
    initials = cleaned; // keep single-word companies as is
  }

  return initials;
}

document.getElementById("cleanBtn").addEventListener("click", () => {
  const input = document.getElementById("input").value;
  const names = input.split("\n").map(n => n.trim()).filter(n => n);
  const results = names.map(cleanName);
  document.getElementById("output").value = results.join("\n");
});

document.getElementById("copyBtn").addEventListener("click", () => {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
});

document.getElementById("resetBtn").addEventListener("click", () => {
  document.getElementById("input").value = "";
  document.getElementById("output").value = "";
});

// Normalizer for company name comparisons
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/^the\s+/g, "") // remove leading "the"
    .replace(/\b(ltd|limited|llc|inc|corp|corporation|company|co\.|pty)\b/g, "")
    .replace(/[^a-z0-9 ]/g, "") // remove punctuation
    .replace(/\s+/g, " ")       // collapse spaces
    .trim();
}

// Tool 2: Compare Lists
document.getElementById("compareBtn").addEventListener("click", () => {
  const acquired = document.getElementById("acquiredList").value
    .split("\n").map(n => n.trim()).filter(n => n);

  const newCompanies = document.getElementById("newList").value
    .split("\n").map(n => n.trim()).filter(n => n);

  const acquiredNormalized = acquired.map(normalizeName);

  const results = newCompanies.map(c => {
    const norm = normalizeName(c);
    if (acquiredNormalized.includes(norm)) {
      return { company: c, status: "Do not contact" };
    } else {
      return { company: c, status: "Contact" };
    }
  });

  // Show color-coded results
  const displayDiv = document.getElementById("compareOutputDisplay");
  displayDiv.innerHTML = results.map(r => {
    const color = r.status === "Contact" ? "green" : "red";
    return `<div><strong>${r.company}</strong> - <span style="color:${color}">${r.status}</span></div>`;
  }).join("");

  // Show scroll-to-top button if list is long
  if (results.length > 15) {
    document.getElementById("scrollTopBtn").style.display = "block";
  }
});

// Reset Tool 2
document.getElementById("resetCompareBtn").addEventListener("click", () => {
  document.getElementById("acquiredList").value = "";
  document.getElementById("newList").value = "";
  document.getElementById("compareOutputDisplay").innerHTML = "";
  document.getElementById("scrollTopBtn").style.display = "none";
});

// Copy Tool 2 Results
document.getElementById("copyCompareBtn").addEventListener("click", () => {
  const resultsText = Array.from(document.getElementById("compareOutputDisplay").children)
    .map(div => div.innerText)
    .join("\n");

  if (resultsText) {
    navigator.clipboard.writeText(resultsText).then(() => {
      alert("Results copied to clipboard!");
    });
  } else {
    alert("No results to copy.");
  }
});

// Scroll to top button
document.getElementById("scrollTopBtn").addEventListener("click", () => {
  document.getElementById("compareOutputDisplay").scrollTo({ top: 0, behavior: "smooth" });
});






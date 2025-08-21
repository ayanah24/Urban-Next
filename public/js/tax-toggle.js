 
    const taxSwitch = document.getElementById("flexSwitchCheckDefault");
    const prices = document.querySelectorAll(".listing-price");
    const taxInfo = document.querySelectorAll(".tax-info");

    taxSwitch.addEventListener("change", () => {
      prices.forEach((priceEl, index) => {
        const basePrice = parseFloat(priceEl.dataset.basePrice);
        if (isNaN(basePrice)) return;

        if (taxSwitch.checked) {
          const taxedPrice = basePrice * 1.18; // add 18% GST
          priceEl.textContent = taxedPrice.toLocaleString("en-IN");
          taxInfo[index].style.display = "inline";
        } else {
          priceEl.textContent = basePrice.toLocaleString("en-IN");
          taxInfo[index].style.display = "none";
        }
      });
    });

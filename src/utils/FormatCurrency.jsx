function FormatCurrency(currency) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(currency).replace(",00", ",-");
}

export default FormatCurrency
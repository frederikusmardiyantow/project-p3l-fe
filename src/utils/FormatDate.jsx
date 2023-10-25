function FormatDate(date) {
  return new Intl.DateTimeFormat("id-ID", { dateStyle: "long" }).format(date);
}

export default FormatDate;

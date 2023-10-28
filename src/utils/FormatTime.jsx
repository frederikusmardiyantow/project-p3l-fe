function FormatTime(date) {
    return new Intl.DateTimeFormat("id-ID", {
      timeStyle: "long",
    }).format(date);
  }
  
  export default FormatTime;
  
function ConvertDateToYYYYMMDD(date) {
  const [month, day, year] = date.split("/");
  const formattedDate = `${year}-${month}-${day}`;
  return formattedDate;
}

export default ConvertDateToYYYYMMDD;

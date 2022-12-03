
import moment from "moment"

const FORMAT_DATETIME = "YYYY.MM.DD HH:mm:ss";

const FORMAT_DATETIME3 = "YYYY.MM.DD HH:mm:ss.SSS";

const FORMAT_DATE = "YYYY.MM.DD";

const formatFromMillis = (millis: string, format: string) => moment(new Date(millis)).format(format);

const formatFromDate = (date: Date, format: string) => moment(date).format(format);

const formatDatetime = (millis: string): string => formatFromMillis(millis, FORMAT_DATETIME)

const formatDate = (millis: string): String => formatFromMillis(millis, FORMAT_DATE);

const nowDatetime = () => formatFromDate(new Date(), FORMAT_DATETIME);

const nowDatetime3 = () => formatFromDate(new Date(), FORMAT_DATETIME3);

const refreshSignal = () => nowDatetime3();

export default {
  formatDatetime,
  formatDate,
  nowDatetime,
  nowDatetime3,
  refreshSignal,
};

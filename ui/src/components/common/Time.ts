
import moment from "moment"

const format = (millis: string, format: string) => moment(new Date(millis)).format(format);

const formatDatetime = (millis: string): string => format(millis, 'YYYY-MM-DD HH:mm:ss')

const formatDate = (millis: string): String => format(millis, 'YYYY-MM-DD');

export default {
  formatDatetime,
  formatDate,
};

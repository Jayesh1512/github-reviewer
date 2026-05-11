type LogFields = Record<string, unknown>;

function format(level: string, msg: string, fields?: LogFields) {
  const line = { level, msg, ts: new Date().toISOString(), ...fields };
  return JSON.stringify(line);
}

export const logger = {
  info(msg: string, fields?: LogFields) {
    console.log(format('info', msg, fields));
  },
  warn(msg: string, fields?: LogFields) {
    console.warn(format('warn', msg, fields));
  },
  error(msg: string, fields?: LogFields) {
    console.error(format('error', msg, fields));
  },
};

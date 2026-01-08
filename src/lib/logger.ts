import pc from "picocolors";

/**
 * Standardized logger utility for the PFTM server.
 * Provides colored output and consistent prefixes.
 */
export const logger = {
  /**
   * Log informational messages (cyan)
   */
  info: (message: string, prefix = "INFO") => {
    console.log(`${pc.cyan(`[${pc.bold(prefix.toUpperCase())}]`)} ${pc.cyan(message)}`);
  },

  /**
   * Log success messages (green)
   */
  success: (message: string, prefix = "SUCCESS") => {
    console.log(`${pc.green(`[${prefix.toUpperCase()}]`)} ${message}`);
  },

  /**
   * Log warning messages (yellow)
   */
  warn: (message: string, prefix = "WARN") => {
    console.warn(`${pc.yellow(`[${prefix.toUpperCase()}]`)} ${message}`);
  },

  /**
   * Log error messages (red)
   */
  error: (message: string, error?: any, prefix = "ERROR") => {
    console.error(`${pc.red(`[${prefix.toUpperCase()}]`)} ${message}`);
    if (error) {
      console.error(error);
    }
  },

  /**
   * Log service-specific progress (bold blue)
   */
  service: (serviceName: string, message: string) => {
    console.log(`${pc.bold(pc.blue(`[${serviceName.toUpperCase()}]`))} ${message}`);
  },

  /**
   * Log prominent header messages (bgBlue white)
   */
  header: (message: string) => {
    console.log("\n" + pc.bgBlue(pc.white(pc.bold(` ${message.toUpperCase()} `))) + "\n");
  }
};

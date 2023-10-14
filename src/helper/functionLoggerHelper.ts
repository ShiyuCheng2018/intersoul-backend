type LogLevel = "INFO" | "ERROR" | "WARN";

export function logHelper({ level, message, functionName, additionalData }: { level: LogLevel, message: string, functionName: string, additionalData?: string }) {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] [${level}] [${functionName}]: ${message}`;

    if (additionalData) {
        console.log(`${logEntry} - ${additionalData}`);
    } else {
        console.log(logEntry);
    }
}
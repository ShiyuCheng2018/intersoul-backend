export function sendResponse(res: any, code: number, success: boolean, message: string, data: any = null, errors: any = null) {
    if(message || errors) console.log(`[message] ${message} [errors] ${errors}`);
    return res.status(code).json({
        success,
        code,
        data,
        message,
        errors
    });
}

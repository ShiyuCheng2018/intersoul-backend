export function sendResponse(res: any, code: number, success: boolean, message: string, data: any = null, errors: any = null) {
    return res.status(code).json({
        success,
        code,
        data,
        message,
        errors
    });
}
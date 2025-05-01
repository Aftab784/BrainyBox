export{}
// Extend the Request interface to include userId
declare global {
    namespace Express {
        interface Request {
            userId?: string;
        }
    }
}

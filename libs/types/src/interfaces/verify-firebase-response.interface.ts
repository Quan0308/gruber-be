export interface IVerifyFirebaseResponse {
    email: string;
    expiresIn: string;
    idToken: string;
    localId: string;
    refreshToken: string;
    registered: boolean;
}
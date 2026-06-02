export interface IAuthenticationResponse {
    access_token: string;
    refresh_token: string;
    token_type: 'bearer';
    user_role: string;
}

export interface IRegisterProfessionalArgs {
    email: string;
    password: string;
    full_name: string;
    specialty: string;
}

export interface IRegisterInstituteArgs {
    email: string;
    password: string;
    facility_name: string;
}

export interface ILoginWithEmailArgs {
    email: string;
    password: string;
}

export interface IChangePasswordArgs {
    old_password: string;
    new_password: string;
}

export interface IAuthenticateWithGoogleArgs {
    id_token: string;
}

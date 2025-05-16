type LoginPayload = {
    email : string;
    password: string;
}
type LoginResponse = {
    message: string;
    status: number;
    data: string;
}
type RegisterPayload = {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
};

type RegisterResponse = {
  message: string;
  status: number;
};
type OtpVerifyPayload = {
  email: string;
  otp: string;
};

type ResendOtpPayload = {
  email: string;
};


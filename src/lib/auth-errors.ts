export function authErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" && error !== null && "code" in error
      ? String(error.code)
      : "";
  switch (code) {
    case "invalid_credentials":
      return "Email atau kata sandi tidak sesuai. Silakan coba lagi.";
    case "email_not_confirmed":
      return "Email belum diverifikasi. Buka tautan verifikasi di kotak masuk Anda.";
    case "user_already_exists":
    case "email_exists":
      return "Email ini sudah terdaftar. Silakan masuk menggunakan akun Anda.";
    case "weak_password":
      return "Kata sandi belum memenuhi ketentuan keamanan. Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol.";
    case "over_email_send_rate_limit":
    case "over_request_rate_limit":
      return "Terlalu banyak percobaan. Tunggu beberapa saat lalu coba lagi.";
    case "signup_disabled":
      return "Pendaftaran belum dibuka. Hubungi pengelola apotek.";
    default:
      return "Permintaan belum berhasil. Periksa koneksi Anda dan coba lagi.";
  }
}

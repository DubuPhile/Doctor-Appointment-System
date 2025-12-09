
const cookieOptions =
  process.env.NODE_ENV === 'production'
    ? {
        httpOnly: true,
        sameSite: 'None',
        secure: true
      }
    : {
        httpOnly: true,
        sameSite: 'Lax',
        secure: false
      };

export default cookieOptions

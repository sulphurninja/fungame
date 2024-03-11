/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env:{
    // "BASE_URL": "http://chakri.deltin.club",
    "BASE_URL": "http://localhost:3000",
    "MONGODB_URL":"mongodb+srv://evilmf:funfun@fungame.2h6nvi8.mongodb.net/?retryWrites=true&w=majority&appName=fungame",
    "ACCESS_TOKEN_SECRET":"erufgyuvbsyudfybvisukfbvu6e6j5rte7ghi4eih76wiyrw7y7ihye7hg4yieyni7ynegynrie47g",
    "REFRESH_TOKEN_SECRET":"fby54uh54uhto4euiot5hh7th47t5h54yt74ith54th74fjkbhjdfkhkjdbvgdhdbdfhkbj"
  }
};

export default nextConfig;

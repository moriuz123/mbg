import { auth } from './src/lib/auth';
async function test() {
  // auth doesn't expose hasher directly in a simple way. But wait.
  console.log(Object.keys(auth));
}
test();

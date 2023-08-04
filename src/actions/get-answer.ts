import axios from "axios"

export async function getAnswer() {
  const response = await axios.get('https://api.github.com/users/pedrop07/repos')
  
  return {
    repos: response
  }
}
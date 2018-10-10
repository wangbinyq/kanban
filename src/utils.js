/**
 * @param  {File} file
 * @returns {Promise<string>}
 */
export function readFile (file) {
  const fr = new FileReader()
  return new Promise((resolve, reject) => {
    fr.onload = (e) => {
      resolve(e.target.result)
    }
    fr.onerror = (err) => reject(err)
    fr.readAsText(file)
  })
}

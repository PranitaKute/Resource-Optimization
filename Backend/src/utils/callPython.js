import axios from "axios";

export async function callPythonScheduler(payload) {
  try {
    const response = await axios.post("${process.env.PYTHON_API_URL}/generate", payload, {
      timeout: 20000,
    });



    return response.data;
  } catch (err) {
    console.error("Scheduler API Error:", err.message);
    throw new Error("Scheduler API Not Responding");
  }
}

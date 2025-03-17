export function initQuote() {
  const quoteText = document.getElementById("quote-text");
  const quoteAuthor = document.getElementById("quote-author");
  const fetchQuoteBtn = document.getElementById("fetch-quote-btn");

  if (quoteText && quoteAuthor && fetchQuoteBtn) {
    fetchQuoteBtn.addEventListener("click", async () => {
      try {
        const response = await fetch("https://api.adviceslip.com/advice");
        if (!response.ok) {
          throw new Error("HTTP Error: " + response.status);
        }
        const data = await response.json();
        quoteText.textContent = data.slip.advice;
        quoteAuthor.textContent = "";
      } catch (error) {
        console.error("Error fetching advice:", error);
        quoteText.textContent = "خطا در دریافت متن!";
        quoteAuthor.textContent = "";
      }
    });
  }
}

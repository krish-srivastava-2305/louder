import puppeteer from "puppeteer";

const getEventsByCity = async (req, res) => {
    try {
        const { cityName } = req.params;

        if (!cityName) {
            return res.status(400).json({ message: "City parameter is required" });
        }

        const browser = await puppeteer.launch({
        headless: true,
        executablePath: puppeteer.executablePath(), // uses bundled Chromium
        args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.goto(`https://insider.in/all-events-in-${cityName.toLowerCase()}`, {
            waitUntil: 'networkidle2'
        });

        // Scroll to load all dynamic content
        await autoScroll(page);

        // Extract events
        const events = await page.evaluate(() => {
            const eventCards = document.querySelectorAll('.card-list-item');
            const data = [];
            let i = 0;

            eventCards.forEach(card => {
                const title = card.querySelector('[data-ref="event_card_title"]')?.innerText.trim() || "";
                const date = card.querySelector('[data-ref="event_card_date_string"] p')?.innerText.trim() || "";
                const link = card.querySelector('a')?.getAttribute('href') || "";
                const fullLink = link ? (link.startsWith("http") ? link : `https://insider.in${link}`) : "";

                if (title && date && fullLink) {
                    data.push({ id: i++ ,title, date, link: fullLink });
                }
            });

            return data;
        });

        await browser.close();

        res.status(200).json({ city: cityName, events });
    } catch (error) {
        console.error("Error fetching events by city:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Utility function to scroll the page until all content is loaded
async function autoScroll(page) {
    await page.evaluate(async () => {
        await new Promise((resolve) => {
            let totalHeight = 0;
            const distance = 100;
            const timer = setInterval(() => {
                const scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if (totalHeight >= scrollHeight - window.innerHeight) {
                    clearInterval(timer);
                    setTimeout(resolve, 1000); // extra wait for final content to load
                }
            }, 300);
        });
    });
}

export default getEventsByCity;

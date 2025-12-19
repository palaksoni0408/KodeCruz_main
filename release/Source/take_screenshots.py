import asyncio
from playwright.async_api import async_playwright

async def take_screenshots():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Dashboard
        print("Navigating to Dashboard...")
        await page.goto("http://localhost:5173")
        await page.wait_for_timeout(2000) # Wait for load
        await page.screenshot(path="screenshots/dashboard.png")
        print("Captured dashboard.png")
        
        # We can't easily login without credentials, so we'll capture the landing page
        # If there are other public pages, we'd go there.
        # For now, just the landing page is better than nothing.
        
        await browser.close()

if __name__ == "__main__":
    asyncio.run(take_screenshots())

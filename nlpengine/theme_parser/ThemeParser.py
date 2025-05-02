import re

THEMES = {
    "Performance": [
        "slow", "lag", "crash", "freeze", "bug", "glitch", "hang", "unresponsive", "stuck"
    ],
    "User Experience (UX)": [
        "navigation", "interface", "layout", "design", "complicated", "confusing", "intuitive", "user friendly"
    ],
    "Pricing & Subscriptions": [
        "subscription", "payment", "expensive", "cheap", "overpriced", "affordable", "premium", "renewal", "billing"
    ],
    "Login / Authentication": [
        "login", "sign in", "authentication", "password", "account access", "can't login", "2fa", "verification"
    ],
    "Features & Functionality": [
        "feature", "missing", "doesn't work", "broken feature", "update removed", "new feature"
    ],
    "Ads & Monetization": [
        "ads", "advertisement", "too many ads", "popup", "in-app purchases", "paywall"
    ],
    "Payment Issues": [
        "payment failed", "card declined", "refund", "transaction error", "charged", "payment gateway"
    ],
    "Content Quality": [
        "audio quality", "sound quality", "streaming quality", "video resolution", "content library", "catalog"
    ],
    "Multiplayer / Social": [
        "friends", "multiplayer", "invite", "party", "social features", "share", "community"
    ],
    "Notifications": [
        "notifications", "alerts", "push notification", "too many notifications", "silent notifications"
    ]
}


class ThemeParser:
    def __init__(self, themes=None):
        self.themes = themes if themes else THEMES

    def clean_text(self, text):
        """Lowercase and basic punctuation cleaning."""
        text = text.lower()
        text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
        return text

    def parse_themes(self, reviews: list) -> dict:
        """Parse themes from a list of review dicts."""
        theme_counts = {theme: 0 for theme in self.themes.keys()}

        for review in reviews:
            text = review.get('text', '')
            if not text:
                continue

            clean_text = self.clean_text(text)

            for theme, keywords in self.themes.items():
                if any(keyword in clean_text for keyword in keywords):
                    theme_counts[theme] += 1

        return theme_counts

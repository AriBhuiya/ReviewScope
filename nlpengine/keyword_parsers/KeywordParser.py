from sklearn.feature_extraction.text import TfidfVectorizer


class KeywordParser:
    def __init__(self):
        # Initialize the TF-IDF vectorizer once
        self.vectorizer = TfidfVectorizer(
            stop_words='english',  # Remove English stopwords
            max_features=1000,  # Limit features for speed
            ngram_range=(1, 2)  # Only unigrams (1-word keywords)
        )

    def parse_and_get_top_keywords(self, reviews, n=20):
        """
        Extract top N keywords from a list of review dicts.

        Args:
            reviews (list): List of dicts with at least 'text' key.
            n (int): Number of top keywords to return.

        Returns:
            list: List of (keyword, tf-idf score) tuples.
        """
        if not reviews:
            return []

        # Extract texts from reviews
        texts = [review.get('text', '') for review in reviews if review.get('text')]

        if not texts:
            return []

        # Fit the TF-IDF vectorizer
        X = self.vectorizer.fit_transform(texts)

        # Get feature names (i.e., keywords)
        feature_names = self.vectorizer.get_feature_names_out()

        # Sum TF-IDF scores across all documents
        sums = X.sum(axis=0)

        # Map feature names to their scores
        terms_scores = [(term, sums[0, idx]) for idx, term in enumerate(feature_names)]

        # Sort by score descending
        sorted_terms = sorted(terms_scores, key=lambda x: x[1], reverse=True)

        # Return top N
        return sorted_terms[:n]

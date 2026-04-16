async fetchReview(): Promise<AttemptReviewDto> {
    const attemptId = await this.ensureAttempt();
    const res = await apiClient.attemptsReviewList(attemptId);
    const review = res.data as AttemptReviewDto;

    runInAction(() => {
      this.review = review;
    });

    return review;
  }

  async fetchTestDetail(): Promise<TestResultDetailResponse> {
    if (this.testId == null) throw new Error("testId отсутствует");
    const res = await apiClient.testResultsTestDetail(this.testId);
    const detail = res.data as TestResultDetailResponse;

    runInAction(() => {
      this.detail = detail;
    });

    return detail;
  }

  async submit(): Promise<
    | { mode: "inline-review" }
    | {
        mode: "navigate-result";
        earned: number;
        max: number;
        timeSec: number;
        attemptsLeft: number | null;
      }
  > {
    if (this.showResult) return { mode: "inline-review" };
    if (this.testId == null) throw new Error("testId отсутствует");

    await this.sendAllAnswers();
    await this.finishAttempt();

    const review = await this.fetchReview();

    if (review.canShowReview) {
      runInAction(() => {
        this.showResult = true;
      });
      return { mode: "inline-review" };
    }

    const detail = await this.fetchTestDetail();

    return {
      mode: "navigate-result",
      earned: review.score,
      max: review.maxScore,
      timeSec: review.timeSpentSec,
      attemptsLeft: detail.attemptsLeft,
    };
  }

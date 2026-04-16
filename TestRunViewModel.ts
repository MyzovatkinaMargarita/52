get notification() {
  return this.root.notificationStore;
}

async submit(navigate: NavigateFunction) {
  try {
    const res = await this.store.submit();

    if (res.mode === "navigate-result") {
      navigate(`/student/test/${this.store.testId}/result`, {
        replace: true,
        state: {
          earned: res.earned,
          max: res.max,
          timeSec: res.timeSec,
          attemptsLeft: res.attemptsLeft,
        },
      });
      return;
    }
  } catch (e) {
    const msg =
      e instanceof Error
        ? e.message
        : "Не удалось отправить ответы. Попробуйте ещё раз.";

    this.notification.push(msg, { tone: "error" });
  }
}

onTimerFinish(navigate: NavigateFunction) {
  if (!this.store.showResult) {
    void this.submit(navigate);
  }
}

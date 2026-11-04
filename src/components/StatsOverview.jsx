import "./StatsOverview.css";

/**
 * StatsOverview component displays live assignment progress metrics.
 *
 * @param {number} total - Total assignments assigned to the student
 * @param {number} submitted - Number of completed assignments
 * @param {number} pending - Number of pending assignments
 */
function StatsOverview({ total = 0, submitted = 0, pending = 0 }) {
  // Safe percentage calculation (avoids division by zero)
  const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0;

  return (
    <div className="stats-container">
      {/* Top Banner: Progress Bar & Ratio */}
      <div className="progress-banner-card">
        <div className="progress-header-row">
          <div>
            <span className="progress-eyebrow">Overall Progress</span>
            <h3 className="progress-headline">
              {submitted} of {total} submitted
            </h3>
          </div>
          <div className="progress-badge-wrapper">
            <span className="percentage-pill">{percentage}% Completed</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div
          className="progress-track"
          role="progressbar"
          aria-valuenow={percentage}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Assignment submission progress"
        >
          <div
            className="progress-fill"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Grid of 3 Metric Cards */}
      <div className="stats-grid">
        {/* Card 1: Total Assigned */}
        <div className="stat-card stat-card-indigo">
          <div className="stat-icon-wrapper stat-icon-indigo">
            <svg
              className="stat-svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{total}</span>
            <span className="stat-label">Total Assigned</span>
          </div>
        </div>

        {/* Card 2: Submitted */}
        <div className="stat-card stat-card-emerald">
          <div className="stat-icon-wrapper stat-icon-emerald">
            <svg
              className="stat-svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{submitted}</span>
            <span className="stat-label">Submitted Work</span>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="stat-card stat-card-amber">
          <div className="stat-icon-wrapper stat-icon-amber">
            <svg
              className="stat-svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <div className="stat-info">
            <span className="stat-value">{pending}</span>
            <span className="stat-label">Pending Action</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatsOverview;
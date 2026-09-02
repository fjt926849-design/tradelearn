interface HeroProps {
  totalTerms: number;
  masteredTerms: number;
  termProgress: number;
}

const delay = (seconds: number) => ({ animationDelay: `${seconds}s` });

export default function Hero({
  totalTerms,
  masteredTerms,
  termProgress,
}: HeroProps) {
  return (
    <section className="hero-section">
      <div className="hero-section-inner">
        <div className="hero">
          {/* 左侧 · 信息区 */}
          <div className="hero-info">
            <p className="hero-kicker hero-anim">国际贸易实务 · 术语卡片</p>
            <h1 className="hero-title">
              <span className="hero-title-cn hero-anim" style={delay(0.08)}>
                贸学
              </span>
              <span className="hero-title-en hero-anim" style={delay(0.16)}>
                TradeLearn
              </span>
            </h1>
            <p className="hero-slogan hero-anim" style={delay(0.24)}>
              把复杂的国际贸易，先从一个术语弄明白。
            </p>
            <p className="hero-desc hero-anim" style={delay(0.3)}>
              用清晰的中文解释、英文名称和业务场景，逐张建立你的外贸术语基础。
            </p>
            <div className="hero-cta hero-anim" style={delay(0.36)}>
              <div className="hero-meta">
                <span>
                  <b>{totalTerms}</b> 个术语
                </span>
                <span className="hero-meta-dot" aria-hidden="true" />
                <span>
                  已掌握 <b>{masteredTerms}</b>
                </span>
                <span className="hero-meta-progress">
                  <span className="hero-meta-bar">
                    <i style={{ width: `${termProgress}%` }} />
                  </span>
                  <span>进度 {termProgress}%</span>
                </span>
              </div>
            </div>
          </div>

          {/* 右侧 · 贸易文件桌面 */}
          <div
            className="hero-visual hero-anim"
            style={delay(0.2)}
            aria-hidden="true"
          >
            <div className="doc-desk">
              {/* 提单 */}
              <div className="doc-card doc-card--bol fade-in" style={delay(0.28)}>
                <div className="doc-card-head">
                  <span>Bill of Lading</span>
                  <em>ORIGINAL</em>
                </div>
                <span className="doc-line" />
                <span className="doc-line doc-line--mid" />
                <div className="doc-route">
                  <span>SHANGHAI</span>
                  <b>→</b>
                  <span>ROTTERDAM</span>
                </div>
                <div className="doc-mono">MSKU 123456 7 · 40&apos;HC</div>
                <div className="doc-barcode" />
              </div>

              {/* 装箱单 */}
              <div className="doc-card doc-card--pl fade-in" style={delay(0.36)}>
                <div className="doc-card-head">
                  <span>Packing List</span>
                  <em>PL-208</em>
                </div>
                <span className="doc-line" />
                <span className="doc-line" />
                <span className="doc-line doc-line--short" />
                <div className="doc-mono">CTNS 120 · G.W. 1,850 KGS</div>
              </div>

              {/* 商业发票 */}
              <div className="doc-card doc-card--inv fade-in" style={delay(0.44)}>
                <div className="doc-card-head">
                  <span>Commercial Invoice</span>
                  <em>INV-1058</em>
                </div>
                <span className="doc-line" />
                <span className="doc-line doc-line--mid" />
                <span className="doc-line doc-line--short" />
                <div className="doc-total">
                  USD <b>42,500.00</b>
                </div>
              </div>

              {/* 信用证 */}
              <div className="doc-card doc-card--lc fade-in" style={delay(0.52)}>
                <div className="doc-card-head">
                  <span>Letter of Credit</span>
                  <em>IRREVOCABLE</em>
                </div>
                <span className="doc-line" />
                <span className="doc-line" />
                <span className="doc-line doc-line--mid" />
                <div className="doc-mono">LC NO. LC20260817</div>
              </div>

              {/* 印章 */}
              <span className="doc-stamp doc-stamp--export">EXPORT</span>
              <span className="doc-stamp doc-stamp--import">IMPORT</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

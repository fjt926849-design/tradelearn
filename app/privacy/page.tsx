import type { Metadata } from "next";
import type { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/learn/BackButton";

export const metadata: Metadata = {
  title: "隐私政策 · 贸学 TradeLearn",
  description: "贸学 TradeLearn 的数据收集、使用和保护说明。",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-8">
        <BackButton fallbackRoute="/" label="返回首页" />
        <article className="mt-8 space-y-8">
          <header>
            <p className="text-xs font-semibold tracking-[0.14em]" style={{ color: "var(--color-accent)" }}>TRADELEARN · PRIVACY</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight">隐私政策</h1>
            <p className="mt-3 text-sm leading-6" style={{ color: "var(--color-text-secondary)" }}>生效日期：2026 年 8 月 31 日</p>
          </header>

          <section className="space-y-3 text-sm leading-7" style={{ color: "var(--color-text-secondary)" }}>
            <p>贸学 TradeLearn 是一个国际贸易实务学习工具。本政策说明网站如何处理学习进度、使用数据和必要的技术信息。</p>
          </section>

          <PolicySection title="一、我们收集什么">
            <p>学习进度（例如章节状态、闪卡评级、复习时间和练习结果）首先保存在你当前设备的浏览器本地存储中。网站不会主动要求你提供姓名、身份证件、支付信息或通讯录。</p>
            <p>在启用云端镜像的环境中，网站会生成一个随机的匿名设备标识，并将闪卡进度、章节练习结果和实战记录写入 Supabase。该标识不是你的姓名或账号，目前也不用于跨设备合并。</p>
            <p>如果网站启用了 Google Analytics，我们可能会收到页面访问、设备类型、粗略地区和学习功能使用事件等统计信息。这些数据用于了解功能使用情况和改进产品，不用于识别个人身份。</p>
          </PolicySection>

          <PolicySection title="二、我们如何使用数据">
            <p>本地学习记录用于恢复你的课程、闪卡和实战进度；统计数据用于衡量页面稳定性、课程完成率和功能使用情况。我们不会出售学习记录，也不会将其用于广告画像。</p>
          </PolicySection>

          <PolicySection title="三、第三方服务">
            <p>网站可能使用 Google Analytics 进行匿名或汇总统计。Google 可能按照其自身隐私政策处理相关技术数据。你可以通过浏览器设置限制 Cookie，或使用浏览器扩展阻止统计脚本；统计脚本未配置时不会加载。</p>
            <p>网站可能使用 Supabase 作为进度数据的服务端镜像。服务端只接收完成学习功能所需的进度字段和匿名设备标识，不接收本地浏览器中的其他内容。</p>
          </PolicySection>

          <PolicySection title="四、数据保存与删除">
            <p>本地进度会一直保存在你的浏览器中，直到你清除网站数据或主动删除。清除浏览器数据可能导致本设备上的学习进度无法恢复；这不会影响其他设备上的数据。</p>
            <p>网站升级时会以追加方式保存新的章节进度，不会主动删除或重置既有知识点记录。当前版本没有页面内的云端数据删除按钮；如需删除服务端镜像，请通过项目仓库联系维护者，并提供你的匿名设备标识。</p>
          </PolicySection>

          <PolicySection title="五、政策更新">
            <p>当数据处理方式或统计工具发生重要变化时，我们会更新本页面的生效日期。继续使用网站表示你已阅读更新后的政策。</p>
          </PolicySection>

          <section className="rounded-lg border p-4 text-xs leading-6" style={{ borderColor: "var(--color-border)", background: "var(--color-bg-soft)", color: "var(--color-text-muted)" }}>
            当前版本以本地学习进度为主，不提供账号登录、账号数据导出或跨设备同步功能。项目维护与反馈入口：<a href="https://github.com/fjt926849-design/tradelearn" target="_blank" rel="noreferrer" className="underline" style={{ color: "var(--color-accent)" }}>TradeLearn GitHub 仓库</a>。
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}

function PolicySection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3 text-sm leading-7" style={{ color: "var(--color-text-secondary)" }}>
      <h2 className="text-base font-semibold" style={{ color: "var(--color-text)" }}>{title}</h2>
      {children}
    </section>
  );
}


import React from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

const Features = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-12">
        <h1 className="text-4xl font-bold mb-8">{t('nav.features')}</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature cards would go here */}
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Bible Study Tools</h3>
            <p className="text-muted-foreground">
              Access comprehensive Bible study tools to deepen your understanding of Scripture.
            </p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">Event Management</h3>
            <p className="text-muted-foreground">
              Organize and manage evangelism events with ease.
            </p>
          </div>
          <div className="border rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-semibold mb-3">AI-Powered Assistance</h3>
            <p className="text-muted-foreground">
              Get intelligent recommendations and insights for your evangelism efforts.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Features;

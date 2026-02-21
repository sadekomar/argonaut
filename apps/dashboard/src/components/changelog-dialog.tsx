"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "changelog-seen-v1";

export function ChangelogDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(STORAGE_KEY)) {
      setOpen(true);
    }
  }, []);

  function handleClose() {
    localStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">
            🚀 New CRM Updates!
          </DialogTitle>
          <DialogDescription>
            Here&apos;s what changed in the latest release.
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[60vh] overflow-y-auto space-y-6 pr-2 text-sm leading-relaxed">
          {/* Salesperson Column */}
          <section className="space-y-2">
            <h3 className="font-semibold text-base">
              👤 Salesperson Column (Quotes Section)
            </h3>
            <p>
              We&apos;ve added a <strong>Salesperson</strong> column next to the
              Author column in the Quotes section.
            </p>
            <p>
              This ensures full-cycle accountability and transparency by clearly
              showing:
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Who from the technical office created the quote</li>
              <li>
                Who is the responsible sales person handling and following up on
                that quote
              </li>
            </ul>
            <p>
              No more ambiguity — full ownership from creation to closure 💪
            </p>
          </section>

          <hr className="border-border" />

          {/* Quotes + Follow-Ups */}
          <section className="space-y-2">
            <h3 className="font-semibold text-base">
              🔄 Quotes + Follow-Ups (Improved Tracking)
            </h3>
            <p>
              We noticed the separate Follow-Ups section was redundant, so
              we&apos;ve now integrated follow-ups directly inside each Quote.
            </p>
            <p>Each follow-up now includes:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>
                📅 <strong>Date Field</strong> – to indicate the latest update
              </li>
              <li>
                📝 <strong>Text Field</strong> – to write any notes, updates, or
                actions taken
              </li>
            </ul>
            <p>
              You can view the complete follow-up history by clicking
              &quot;View&quot; inside each individual quote.
            </p>
            <p>Everything is now centralized and easier to track.</p>
          </section>

          <hr className="border-border" />

          {/* Export to CSV */}
          <section className="space-y-2">
            <h3 className="font-semibold text-base">📊 Export to CSV</h3>
            <p>You can now export your data to CSV.</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Apply any filter you need</li>
              <li>Click Export to CSV</li>
              <li>Download the table directly to Excel</li>
            </ul>
            <p>
              This allows you to easily create reports based on filtered data.
            </p>
          </section>
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

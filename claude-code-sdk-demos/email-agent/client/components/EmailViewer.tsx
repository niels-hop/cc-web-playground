import React from 'react';
import { X } from 'lucide-react';
import { useScreenshotMode } from '../context/ScreenshotModeContext';
import {
  getPlaceholderEmail,
  getPlaceholderName,
  getPlaceholderSubject,
  getPlaceholderBodyText
} from '../utils/placeholders';

interface Email {
  id: number;
  message_id: string;
  subject: string;
  from_address: string;
  from_name?: string;
  to_address?: string;
  date_sent: string;
  body_text?: string;
  body_html?: string;
  snippet?: string;
  is_read: boolean;
  is_starred: boolean;
  has_attachments: boolean;
  folder?: string;
}

interface EmailViewerProps {
  email: Email | null;
  onClose: () => void;
}

export function EmailViewer({ email, onClose }: EmailViewerProps) {
  const { isScreenshotMode } = useScreenshotMode();

  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50 border-r border-gray-200">
        <div className="text-center text-gray-400">
          <p className="text-sm">Select an email to view</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-white border-r border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-2">
              {isScreenshotMode ? getPlaceholderSubject(0) : (email.subject || '(No subject)')}
            </h2>
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">From:</span>
                <span className="font-medium">
                  {isScreenshotMode
                    ? `${getPlaceholderName(0)} <${getPlaceholderEmail(0)}>`
                    : (email.from_name ? `${email.from_name} <${email.from_address}>` : email.from_address)}
                </span>
              </div>
              {email.to_address && (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">To:</span>
                  <span>
                    {isScreenshotMode ? getPlaceholderEmail(1) : email.to_address}
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                {isScreenshotMode ? 'Monday, Jan 1, 2024, 10:00 AM' : formatDate(email.date_sent)}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
            title="Close"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Email Body */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="prose prose-sm max-w-none">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-900">
            {isScreenshotMode
              ? getPlaceholderBodyText()
              : (email.body_text || email.snippet || 'No content available')}
          </pre>
        </div>
      </div>
    </div>
  );
}
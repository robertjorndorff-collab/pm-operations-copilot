'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MessageSquare, Mail, BarChart3 } from 'lucide-react';

export default function GlobalNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Meeting Intelligence',
      href: '/meeting-analyzer',
      icon: MessageSquare,
    },
    {
      name: 'Email Intelligence',
      href: '/email-analyzer',
      icon: Mail,
    },
  ];

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            <span className="font-bold text-lg">PM Operations Copilot</span>
          </div>
          <div className="flex gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}

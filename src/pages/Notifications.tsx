import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, CheckCircle, XCircle, Bell } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  type: "low_stock" | "expiring" | "expired" | "success";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "low_stock",
      title: "Low Stock Alert",
      message: "Amoxicillin 250mg stock is running low (3 units remaining)",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: "2",
      type: "expiring",
      title: "Expiring Soon",
      message: "Ibuprofen 400mg will expire in 27 days",
      timestamp: "5 hours ago",
      read: false,
    },
    {
      id: "3",
      type: "success",
      title: "Stock Updated",
      message: "Paracetamol 500mg stock increased by 50 units",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "4",
      type: "low_stock",
      title: "Low Stock Alert",
      message: "Vitamin C 1000mg stock is running low (8 units remaining)",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: "5",
      type: "expiring",
      title: "Expiring Soon",
      message: "Cetirizine 10mg will expire in 32 days",
      timestamp: "2 days ago",
      read: true,
    },
  ]);
  const { toast } = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    toast({ title: "All notifications marked as read" });
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    toast({ title: "Notification deleted" });
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="w-5 h-5 text-warning" />;
      case "expiring":
        return <Clock className="w-5 h-5 text-accent" />;
      case "expired":
        return <XCircle className="w-5 h-5 text-destructive" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" />;
      default:
        return <Bell className="w-5 h-5 text-primary" />;
    }
  };

  const getVariant = (type: string) => {
    switch (type) {
      case "low_stock":
        return "warning";
      case "expiring":
        return "outline";
      case "expired":
        return "destructive";
      case "success":
        return "success";
      default:
        return "default";
    }
  };

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-2">
            Stay updated with your pharmacy alerts
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <Badge variant="warning" className="text-sm px-3 py-1">
              {unreadCount} unread
            </Badge>
          )}
          <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark All as Read
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <Card className="p-12 text-center border-border/50 bg-card/80 backdrop-blur-sm">
            <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-lg text-muted-foreground">No notifications</p>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`p-5 border-border/50 backdrop-blur-sm transition-all hover:shadow-md ${
                !notification.read ? "bg-primary/5 border-primary/20" : "bg-card/80"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  notification.type === "low_stock" ? "bg-warning/10" :
                  notification.type === "expiring" ? "bg-accent/10" :
                  notification.type === "success" ? "bg-success/10" :
                  "bg-destructive/10"
                }`}>
                  {getIcon(notification.type)}
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-semibold text-foreground">{notification.title}</h3>
                    <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                  <div className="flex items-center gap-2">
                    {!notification.read && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => markAsRead(notification.id)}
                        className="h-7 text-xs hover:bg-primary/10 hover:text-primary"
                      >
                        Mark as Read
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteNotification(notification.id)}
                      className="h-7 text-xs hover:bg-destructive/10 hover:text-destructive"
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

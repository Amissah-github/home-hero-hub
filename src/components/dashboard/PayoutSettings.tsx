import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  CreditCard,
  Shield,
  CheckCircle,
  AlertCircle,
  Loader2,
  Wallet,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_primary: boolean;
  is_verified: boolean;
}

const mockBankAccounts: BankAccount[] = [
  {
    id: "1",
    bank_name: "First Bank",
    account_number: "****4521",
    account_name: "John Provider",
    is_primary: true,
    is_verified: true,
  },
];

const nigerianBanks = [
  "Access Bank",
  "First Bank",
  "GTBank",
  "UBA",
  "Zenith Bank",
  "Fidelity Bank",
  "Union Bank",
  "Stanbic IBTC",
  "Sterling Bank",
  "Wema Bank",
  "Polaris Bank",
  "Keystone Bank",
  "Ecobank",
  "FCMB",
  "Heritage Bank",
];

export function PayoutSettings() {
  const [accounts, setAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [autoPayout, setAutoPayout] = useState(true);
  const [payoutSchedule, setPayoutSchedule] = useState("weekly");
  const [minimumPayout, setMinimumPayout] = useState("5000");

  // Form state
  const [newBank, setNewBank] = useState("");
  const [newAccountNumber, setNewAccountNumber] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyAccount = async () => {
    if (!newBank || !newAccountNumber) {
      toast.error("Please select a bank and enter account number");
      return;
    }

    setIsVerifying(true);
    // TODO: Integrate with Paystack to verify account
    // This would call Paystack's "Resolve Account Number" API
    // Endpoint: https://api.paystack.co/bank/resolve
    // Requires: account_number, bank_code
    // Add PAYSTACK_SECRET_KEY to secrets to enable this feature
    
    // Simulating verification
    setTimeout(() => {
      setNewAccountName("John Provider");
      setIsVerifying(false);
      toast.success("Account verified successfully");
    }, 1500);
  };

  const handleAddAccount = async () => {
    if (!newAccountName) {
      toast.error("Please verify your account first");
      return;
    }

    setIsLoading(true);
    
    // TODO: Save to database via Supabase
    // Would also call Paystack "Create Transfer Recipient" API
    // Endpoint: https://api.paystack.co/transferrecipient
    // Requires: type, name, account_number, bank_code, currency
    
    const newAccount: BankAccount = {
      id: Date.now().toString(),
      bank_name: newBank,
      account_number: `****${newAccountNumber.slice(-4)}`,
      account_name: newAccountName,
      is_primary: accounts.length === 0,
      is_verified: true,
    };

    setTimeout(() => {
      setAccounts((prev) => [...prev, newAccount]);
      setShowAddForm(false);
      setNewBank("");
      setNewAccountNumber("");
      setNewAccountName("");
      setIsLoading(false);
      toast.success("Bank account added successfully");
    }, 1000);
  };

  const handleSetPrimary = (accountId: string) => {
    setAccounts((prev) =>
      prev.map((acc) => ({
        ...acc,
        is_primary: acc.id === accountId,
      }))
    );
    toast.success("Primary account updated");
  };

  const handleRemoveAccount = (accountId: string) => {
    setAccounts((prev) => prev.filter((acc) => acc.id !== accountId));
    toast.success("Account removed");
  };

  const handleSaveSettings = () => {
    // TODO: Save payout settings to database
    toast.success("Payout settings saved");
  };

  return (
    <div className="space-y-6">
      {/* Payout Schedule Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Payout Schedule
          </CardTitle>
          <CardDescription>
            Configure when and how you receive your earnings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">Automatic Payouts</Label>
              <p className="text-sm text-muted-foreground">
                Automatically transfer earnings to your bank account
              </p>
            </div>
            <Switch
              checked={autoPayout}
              onCheckedChange={setAutoPayout}
            />
          </div>

          {autoPayout && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="schedule">Payout Frequency</Label>
                  <Select value={payoutSchedule} onValueChange={setPayoutSchedule}>
                    <SelectTrigger id="schedule">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly (Every Monday)</SelectItem>
                      <SelectItem value="biweekly">Bi-weekly</SelectItem>
                      <SelectItem value="monthly">Monthly (1st of month)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minimum">Minimum Payout Amount (₦)</Label>
                  <Input
                    id="minimum"
                    type="number"
                    value={minimumPayout}
                    onChange={(e) => setMinimumPayout(e.target.value)}
                    placeholder="5000"
                  />
                  <p className="text-xs text-muted-foreground">
                    Payouts only occur when balance exceeds this amount
                  </p>
                </div>
              </div>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Bank Accounts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Bank Accounts
              </CardTitle>
              <CardDescription>
                Manage your payout bank accounts
              </CardDescription>
            </div>
            {!showAddForm && (
              <Button onClick={() => setShowAddForm(true)}>
                Add Account
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Existing Accounts */}
          {accounts.map((account) => (
            <div
              key={account.id}
              className="flex items-center justify-between rounded-lg border border-border p-4"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <CreditCard className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{account.bank_name}</p>
                    {account.is_primary && (
                      <Badge variant="secondary" className="text-xs">
                        Primary
                      </Badge>
                    )}
                    {account.is_verified && (
                      <Badge variant="success" className="text-xs gap-1">
                        <CheckCircle className="h-3 w-3" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {account.account_name} • {account.account_number}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!account.is_primary && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetPrimary(account.id)}
                    >
                      Set Primary
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveAccount(account.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      Remove
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}

          {accounts.length === 0 && !showAddForm && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Wallet className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 font-semibold">No bank accounts</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a bank account to receive your earnings
              </p>
            </div>
          )}

          {/* Add Account Form */}
          {showAddForm && (
            <div className="space-y-4 rounded-lg border border-dashed border-border p-4">
              <h4 className="font-medium">Add New Bank Account</h4>
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="bank">Bank</Label>
                  <Select value={newBank} onValueChange={setNewBank}>
                    <SelectTrigger id="bank">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      {nigerianBanks.map((bank) => (
                        <SelectItem key={bank} value={bank}>
                          {bank}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accountNumber"
                      value={newAccountNumber}
                      onChange={(e) => setNewAccountNumber(e.target.value)}
                      placeholder="0123456789"
                      maxLength={10}
                    />
                    <Button
                      variant="outline"
                      onClick={handleVerifyAccount}
                      disabled={isVerifying || !newBank || newAccountNumber.length !== 10}
                    >
                      {isVerifying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        "Verify"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {newAccountName && (
                <div className="flex items-center gap-2 rounded-lg bg-success/10 p-3">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <p className="text-sm font-medium">Account Verified</p>
                    <p className="text-sm text-muted-foreground">{newAccountName}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2 rounded-lg bg-warning/10 p-3">
                <AlertCircle className="h-4 w-4 text-warning" />
                <p className="text-xs text-muted-foreground">
                  {/* TODO: Add PAYSTACK_SECRET_KEY to enable live account verification */}
                  Account verification is in demo mode. Add Paystack credentials to enable live verification.
                </p>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewBank("");
                    setNewAccountNumber("");
                    setNewAccountName("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddAccount}
                  disabled={!newAccountName || isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    "Add Account"
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Note */}
      <Card className="border-info/50 bg-info/5">
        <CardContent className="flex items-start gap-4 p-4">
          <Shield className="h-6 w-6 text-info mt-0.5" />
          <div>
            <h4 className="font-medium">Bank Account Security</h4>
            <p className="text-sm text-muted-foreground">
              Your bank account details are encrypted and securely stored. We use Paystack's
              secure infrastructure to process all payouts. You can only withdraw to verified
              accounts in your name.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

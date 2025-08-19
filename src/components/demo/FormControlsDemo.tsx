import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export const FormControlsDemo: React.FC = () => {
  const [selectedNotification, setSelectedNotification] = useState('email');
  const [checkboxStates, setCheckboxStates] = useState({
    newsletter: false,
    updates: true,
    marketing: false,
    analytics: false,
  });

  const handleCheckboxChange = (key: string, checked: boolean) => {
    setCheckboxStates(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-2">Carbon Design System Form Controls</h1>
        <p className="text-muted-foreground">
          Updated radio buttons and checkboxes following Carbon Design System guidelines
        </p>
      </div>

      {/* Radio Buttons Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Radio Button Group</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="form-field">
            <Label className="text-base font-medium mb-3 block">
              How would you like to receive notifications?
            </Label>
            <RadioGroup
              value={selectedNotification}
              onValueChange={setSelectedNotification}
              className="radio-group"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="email" id="email" />
                <Label htmlFor="email" className="text-sm">
                  Email notifications
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="sms" id="sms" />
                <Label htmlFor="sms" className="text-sm">
                  SMS text messages
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="push" id="push" />
                <Label htmlFor="push" className="text-sm">
                  Push notifications
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="none" id="none" />
                <Label htmlFor="none" className="text-sm">
                  No notifications
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Horizontal Radio Group */}
          <div className="form-field">
            <Label className="text-base font-medium mb-3 block">
              Training frequency preference
            </Label>
            <RadioGroup
              defaultValue="weekly"
              className="radio-group-horizontal"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="daily" id="daily" />
                <Label htmlFor="daily" className="text-sm">
                  Daily
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="weekly" id="weekly" />
                <Label htmlFor="weekly" className="text-sm">
                  Weekly
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="monthly" id="monthly" />
                <Label htmlFor="monthly" className="text-sm">
                  Monthly
                </Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Checkboxes Demo */}
      <Card>
        <CardHeader>
          <CardTitle>Checkbox Group</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="form-field">
            <Label className="text-base font-medium mb-3 block">
              Communication preferences (select all that apply)
            </Label>
            <div className="checkbox-group">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="newsletter"
                  checked={checkboxStates.newsletter}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('newsletter', checked as boolean)
                  }
                />
                <Label htmlFor="newsletter" className="text-sm">
                  Monthly newsletter with training updates
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="updates"
                  checked={checkboxStates.updates}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('updates', checked as boolean)
                  }
                />
                <Label htmlFor="updates" className="text-sm">
                  System updates and maintenance notifications
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="marketing"
                  checked={checkboxStates.marketing}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('marketing', checked as boolean)
                  }
                />
                <Label htmlFor="marketing" className="text-sm">
                  Marketing emails about new features
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="analytics"
                  checked={checkboxStates.analytics}
                  onCheckedChange={(checked) => 
                    handleCheckboxChange('analytics', checked as boolean)
                  }
                />
                <Label htmlFor="analytics" className="text-sm">
                  Usage analytics and performance reports
                </Label>
              </div>
            </div>
          </div>

          {/* Horizontal Checkbox Group */}
          <div className="form-field">
            <Label className="text-base font-medium mb-3 block">
              Quick preferences
            </Label>
            <div className="checkbox-group-horizontal">
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" defaultChecked />
                <Label htmlFor="terms" className="text-sm">
                  I agree to terms
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="privacy" />
                <Label htmlFor="privacy" className="text-sm">
                  Privacy policy
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="cookies" defaultChecked />
                <Label htmlFor="cookies" className="text-sm">
                  Accept cookies
                </Label>
              </div>
            </div>
          </div>

          {/* States Demo */}
          <div className="form-field">
            <Label className="text-base font-medium mb-3 block">
              Component states
            </Label>
            <div className="checkbox-group">
              <div className="flex items-center space-x-3">
                <Checkbox id="checked" defaultChecked />
                <Label htmlFor="checked" className="text-sm">
                  Checked state
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="unchecked" />
                <Label htmlFor="unchecked" className="text-sm">
                  Unchecked state
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="disabled-checked" defaultChecked disabled />
                <Label htmlFor="disabled-checked" className="text-sm opacity-50">
                  Disabled (checked)
                </Label>
              </div>
              <div className="flex items-center space-x-3">
                <Checkbox id="disabled-unchecked" disabled />
                <Label htmlFor="disabled-unchecked" className="text-sm opacity-50">
                  Disabled (unchecked)
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Button>Save Preferences</Button>
            <Button variant="outline">Reset to Defaults</Button>
          </div>
          
          <div className="mt-4 p-3 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              <strong>Selected notification method:</strong> {selectedNotification}
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Active preferences:</strong>{' '}
              {Object.entries(checkboxStates)
                .filter(([_, checked]) => checked)
                .map(([key, _]) => key)
                .join(', ') || 'None'}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
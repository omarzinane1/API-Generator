"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"

interface Parameter {
  name: string
  type: string
  required: boolean
}

interface DynamicTestFormProps {
  parameters: Parameter[]
  values: Record<string, any>
  onValuesChange: (values: Record<string, any>) => void
}

export function DynamicTestForm({ parameters, values, onValuesChange }: DynamicTestFormProps) {
  const updateValue = (name: string, value: any, type: string) => {
    let parsedValue = value

    if (type === "number") {
      parsedValue = value === "" ? "" : Number(value)
    } else if (type === "boolean") {
      parsedValue = value
    }

    onValuesChange({
      ...values,
      [name]: parsedValue,
    })
  }

  if (parameters.length === 0) {
    return (
      <div className="p-6 border-2 border-dashed rounded-lg text-center text-sm text-muted-foreground">
        This function has no input parameters
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {parameters.map((param) => (
        <div key={param.name} className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor={param.name}>{param.name}</Label>
            <Badge variant="outline" className="text-xs">
              {param.type}
            </Badge>
            {param.required && (
              <Badge variant="secondary" className="text-xs">
                Required
              </Badge>
            )}
          </div>

          {param.type === "boolean" ? (
            <div className="flex items-center space-x-2 pt-2">
              <Checkbox
                id={param.name}
                checked={values[param.name] || false}
                onCheckedChange={(checked) => updateValue(param.name, checked, param.type)}
              />
              <Label htmlFor={param.name} className="text-sm font-normal cursor-pointer">
                {values[param.name] ? "true" : "false"}
              </Label>
            </div>
          ) : (
            <Input
              id={param.name}
              type={param.type === "number" ? "number" : "text"}
              placeholder={`Enter ${param.name}`}
              value={values[param.name] ?? ""}
              onChange={(e) => updateValue(param.name, e.target.value, param.type)}
            />
          )}
        </div>
      ))}
    </div>
  )
}

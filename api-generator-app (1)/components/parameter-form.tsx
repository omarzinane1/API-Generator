"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, X } from "lucide-react"

interface Parameter {
  id: string
  name: string
  type: string
  required: boolean
}

interface ParameterFormProps {
  parameters: Parameter[]
  onParametersChange: (parameters: Parameter[]) => void
}

export function ParameterForm({ parameters, onParametersChange }: ParameterFormProps) {
  const addParameter = () => {
    const newParam: Parameter = {
      id: crypto.randomUUID(),
      name: "",
      type: "string",
      required: false,
    }
    onParametersChange([...parameters, newParam])
  }

  const removeParameter = (id: string) => {
    onParametersChange(parameters.filter((p) => p.id !== id))
  }

  const updateParameter = (id: string, field: keyof Parameter, value: string | boolean) => {
    onParametersChange(parameters.map((p) => (p.id === id ? { ...p, [field]: value } : p)))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="text-base">Input Parameters</Label>
        <Button type="button" variant="outline" size="sm" onClick={addParameter}>
          <Plus className="h-4 w-4 mr-2" />
          Add Parameter
        </Button>
      </div>

      {parameters.length === 0 ? (
        <div className="p-6 border-2 border-dashed rounded-lg text-center text-sm text-muted-foreground">
          No parameters defined. Click "Add Parameter" to get started.
        </div>
      ) : (
        <div className="space-y-3">
          {parameters.map((param, index) => (
            <div key={param.id} className="flex items-end gap-3 p-4 rounded-lg bg-muted/50">
              <div className="flex-1 space-y-2">
                <Label htmlFor={`param-name-${param.id}`} className="text-xs">
                  Parameter Name
                </Label>
                <Input
                  id={`param-name-${param.id}`}
                  placeholder="e.g., userId"
                  value={param.name}
                  onChange={(e) => updateParameter(param.id, "name", e.target.value)}
                />
              </div>

              <div className="w-32 space-y-2">
                <Label htmlFor={`param-type-${param.id}`} className="text-xs">
                  Type
                </Label>
                <Select value={param.type} onValueChange={(value) => updateParameter(param.id, "type", value)}>
                  <SelectTrigger id={`param-type-${param.id}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">String</SelectItem>
                    <SelectItem value="number">Number</SelectItem>
                    <SelectItem value="boolean">Boolean</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2 pb-2">
                <Checkbox
                  id={`param-required-${param.id}`}
                  checked={param.required}
                  onCheckedChange={(checked) => updateParameter(param.id, "required", checked as boolean)}
                />
                <Label htmlFor={`param-required-${param.id}`} className="text-xs cursor-pointer">
                  Required
                </Label>
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeParameter(param.id)}
                className="mb-0.5"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

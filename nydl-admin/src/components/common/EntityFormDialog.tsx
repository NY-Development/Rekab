import { useState, type ReactElement, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export interface EntityFieldConfig {
  name: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'date' | 'datetime' | 'url' | 'password';
  placeholder?: string;
  options?: { value: string; label: string }[];
}

interface EntityFormDialogProps<Schema extends z.ZodTypeAny> {
  triggerLabel: string;
  title: string;
  schema: Schema;
  fields: EntityFieldConfig[];
  defaultValues?: Partial<z.infer<Schema>>;
  onSubmit: (data: z.infer<Schema>) => Promise<unknown>;
  submitLabel?: string;
  trigger?: ReactElement;
  triggerContent?: ReactNode;
}

export function EntityFormDialog<Schema extends z.ZodTypeAny>({
  triggerLabel,
  title,
  schema,
  fields,
  defaultValues,
  onSubmit,
  submitLabel = 'Create',
  trigger,
  triggerContent,
}: EntityFormDialogProps<Schema>) {
  const [open, setOpen] = useState(false);
  type FormValues = z.infer<Schema> & Record<string, any>;

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as never,
  });

  const errorMap = errors as Record<string, { message?: string } | undefined>;

  const onFormSubmit = handleSubmit(async (data) => {
    try {
      await onSubmit(data as z.infer<Schema>);
      reset();
      setOpen(false);
    } catch {
      // caller surfaces the error via toast
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger ?? <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold" />}>
        {trigger ? (
          triggerContent
        ) : (
          <>
            <Plus className="mr-2 h-4 w-4" /> {triggerLabel}
          </>
        )}
      </DialogTrigger>
      <DialogContent className="bg-slate-950 border-slate-800 text-white sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onFormSubmit} className="space-y-4">
          {fields.map((field) => {
            const fieldError = errorMap[field.name];
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-slate-300">
                  {field.label}
                </Label>
                {field.type === 'textarea' ? (
                  <Textarea
                    id={field.name}
                    placeholder={field.placeholder}
                    className="bg-slate-900 border-slate-800 text-white"
                    {...register(field.name as never)}
                  />
                ) : field.type === 'select' ? (
                  <Select
                    defaultValue={(defaultValues as Record<string, string>)?.[field.name]}
                    onValueChange={(v) => setValue(field.name as never, v as never, { shouldValidate: true })}
                  >
                    <SelectTrigger className="bg-slate-900 border-slate-800 text-white w-full">
                      <SelectValue placeholder={field.placeholder} />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800 text-white">
                      {field.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  <Input
                    id={field.name}
                    type={
                      field.type === 'number'
                        ? 'number'
                        : field.type === 'date'
                          ? 'date'
                          : field.type === 'datetime'
                            ? 'datetime-local'
                            : field.type === 'url'
                              ? 'url'
                              : field.type === 'password'
                                ? 'password'
                                : 'text'
                    }
                    placeholder={field.placeholder}
                    className="bg-slate-900 border-slate-800 text-white"
                    {...register(
                      field.name as never,
                      field.type === 'number' ? { valueAsNumber: true } : {}
                    )}
                  />
                )}
                {fieldError && (
                  <p className="text-xs text-rose-400">{String(fieldError.message)}</p>
                )}
              </div>
            );
          })}
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                submitLabel
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default EntityFormDialog;

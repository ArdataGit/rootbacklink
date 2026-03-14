import { Transition } from '@headlessui/react';
import { Form, Head, Link, usePage } from '@inertiajs/react';
import ProfileController from '@/actions/App/Http/Controllers/Settings/ProfileController';
import DeleteUser from '@/components/delete-user';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import SettingsLayout from '@/layouts/settings/layout';
import { edit } from '@/routes/profile';
import { send } from '@/routes/verification';
import type { BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Profile settings',
        href: edit(),
    },
];

export default function Profile({
    mustVerifyEmail,
    status,
}: {
    mustVerifyEmail: boolean;
    status?: string;
}) {
    const { auth } = usePage().props;

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Profile settings" />

            <h1 className="sr-only">Profile settings</h1>

            <SettingsLayout>
                <div className="space-y-6">
                    <Heading
                        variant="small"
                        title="Profile information"
                        description="Update your name, email, and contact details"
                    />

                    <Form
                        {...ProfileController.update.form()}
                        options={{
                            preserveScroll: true,
                        }}
                        className="space-y-6"
                    >
                        {({ processing, recentlySuccessful, errors }) => (
                            <>
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Nama Lengkap</Label>
                                    <Input
                                        id="name"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.name}
                                        name="name"
                                        required
                                        autoComplete="name"
                                        placeholder="Nama lengkap"
                                    />
                                    <InputError className="mt-2" message={errors.name} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        defaultValue={auth.user.email}
                                        name="email"
                                        required
                                        autoComplete="username"
                                        placeholder="Email address"
                                    />
                                    <InputError className="mt-2" message={errors.email} />
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="whatsapp">Nomor WhatsApp</Label>
                                    <Input
                                        id="whatsapp"
                                        type="text"
                                        className="mt-1 block w-full"
                                        defaultValue={(auth.user.whatsapp as string) || ''}
                                        name="whatsapp"
                                        autoComplete="tel"
                                        placeholder="08xxxxxxxxxx"
                                    />
                                    <InputError className="mt-2" message={errors.whatsapp} />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="province">Provinsi</Label>
                                        <Input
                                            id="province"
                                            type="text"
                                            className="mt-1 block w-full"
                                            defaultValue={(auth.user.province as string) || ''}
                                            name="province"
                                            placeholder="Jawa Barat"
                                        />
                                        <InputError className="mt-2" message={errors.province} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="city">Kota</Label>
                                        <Input
                                            id="city"
                                            type="text"
                                            className="mt-1 block w-full"
                                            defaultValue={(auth.user.city as string) || ''}
                                            name="city"
                                            placeholder="Bandung"
                                        />
                                        <InputError className="mt-2" message={errors.city} />
                                    </div>
                                </div>

                                <div className="space-y-6 pt-6">
                                    <Heading
                                        variant="small"
                                        title="Informasi Rekening Bank"
                                        description="Informasi ini digunakan untuk pencairan dana"
                                    />

                                    <div className="grid gap-2">
                                        <Label htmlFor="bank_name">Nama Bank</Label>
                                        <Input
                                            id="bank_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            defaultValue={(auth.user.bank_name as string) || ''}
                                            name="bank_name"
                                            placeholder="BCA / Mandiri / BNI"
                                        />
                                        <InputError className="mt-2" message={errors.bank_name} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bank_account_number">Nomor Rekening</Label>
                                        <Input
                                            id="bank_account_number"
                                            type="text"
                                            className="mt-1 block w-full"
                                            defaultValue={(auth.user.bank_account_number as string) || ''}
                                            name="bank_account_number"
                                            placeholder="1234567890"
                                        />
                                        <InputError className="mt-2" message={errors.bank_account_number} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="bank_account_name">Nama Pemilik Rekening</Label>
                                        <Input
                                            id="bank_account_name"
                                            type="text"
                                            className="mt-1 block w-full"
                                            defaultValue={(auth.user.bank_account_name as string) || ''}
                                            name="bank_account_name"
                                            placeholder="Nama sesuai buku tabungan"
                                        />
                                        <InputError className="mt-2" message={errors.bank_account_name} />
                                    </div>
                                </div>

                                {mustVerifyEmail &&
                                    auth.user.email_verified_at === null && (
                                        <div>
                                            <p className="-mt-4 text-sm text-muted-foreground">
                                                Your email address is
                                                unverified.{' '}
                                                <Link
                                                    href={send()}
                                                    as="button"
                                                    className="text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500"
                                                >
                                                    Click here to resend the
                                                    verification email.
                                                </Link>
                                            </p>

                                            {status ===
                                                'verification-link-sent' && (
                                                <div className="mt-2 text-sm font-medium text-green-600">
                                                    A new verification link has
                                                    been sent to your email
                                                    address.
                                                </div>
                                            )}
                                        </div>
                                    )}

                                <div className="flex items-center gap-4">
                                    <Button
                                        disabled={processing}
                                        data-test="update-profile-button"
                                    >
                                        Simpan
                                    </Button>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-neutral-600">
                                            Tersimpan
                                        </p>
                                    </Transition>
                                </div>
                            </>
                        )}
                    </Form>
                </div>

                <DeleteUser />
            </SettingsLayout>
        </AppLayout>
    );
}

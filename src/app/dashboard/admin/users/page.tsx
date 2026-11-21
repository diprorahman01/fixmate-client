
"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  RefreshCw,
  Users,
  ShieldCheck,
} from "lucide-react";

import { toast } from "sonner";
import { useSession } from "@/lib/auth-client";

import {
  getAdminUsers,
  updateUserRole,
  type AdminUser,
  type UserRole,
} from "@/lib/admin";

const roles: UserRole[] = [
  "customer",
  "technician",
  "admin",
];

function errorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Something went wrong";
}

function formatDate(value: string | null) {
  if (!value) return "Not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ==========================================
// MANAGE USERS PAGE
// ==========================================

export default function ManageUsersPage() {
  const { data: session } = useSession();

  const [users, setUsers] =
    useState<AdminUser[]>([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [busyId, setBusyId] =
    useState<string | null>(null);

  const [roleChange, setRoleChange] =
    useState<{
      user: AdminUser;
      role: UserRole;
    } | null>(null);

  useEffect(() => {
    let active = true;

    getAdminUsers()
      .then((data) => {
        if (active) setUsers(data);
      })
      .catch((err: unknown) => {
        if (active) setError(errorMessage(err));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  async function refreshUsers() {
    setLoading(true);
    setError("");

    try {
      setUsers(await getAdminUsers());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function confirmRoleChange() {
    if (!roleChange || busyId) return;

    const { user, role } = roleChange;

    setBusyId(user.id);

    try {
      const result = await updateUserRole(
        user.id,
        role
      );

      setUsers((previous) =>
        previous.map((item) =>
          item.id === user.id
            ? { ...item, role }
            : item
        )
      );

      setRoleChange(null);
      toast.success(result.message);
    } catch (err) {
      toast.error(errorMessage(err));
      setRoleChange(null);
      await refreshUsers();
    } finally {
      setBusyId(null);
    }
  }

  return (
    <section className="pb-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-xs font-semibold text-primary">
            <Users className="size-4" />
            Account Administration
          </div>

          <h1 className="text-3xl font-extrabold">
            Manage Users
          </h1>

          <p className="mt-3 text-muted-foreground">
            View registered accounts and manage
            their access permissions.
          </p>
        </div>

        <button
          type="button"
          disabled={loading || busyId !== null}
          onClick={() => void refreshUsers()}
          className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-3 text-sm font-semibold disabled:opacity-50"
        >
          <RefreshCw className="size-4" />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl border border-border bg-card p-10 text-center">
          <Loader2 className="mx-auto mb-3 size-7 animate-spin text-primary" />
          Loading users...
        </div>
      ) : error ? (
        <div
          role="alert"
          className="rounded-2xl border border-red-500/30 bg-card p-8 text-red-600"
        >
          {error}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-border bg-card">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-5 py-4">
                  User
                </th>
                <th className="px-5 py-4">
                  Email
                </th>
                <th className="px-5 py-4">
                  Joined
                </th>
                <th className="px-5 py-4">
                  Role
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const isSelf =
                  session?.user?.id === user.id ||
                  session?.user?.email === user.email;

                return (
                  <tr
                    key={user.id}
                    className="border-t border-border"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 font-bold text-primary">
                          {user.image ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={user.image}
                              alt={user.name}
                              className="size-full object-cover"
                            />
                          ) : (
                            user.name.charAt(0).toUpperCase()
                          )}
                        </div>

                        <div>
                          <p className="font-semibold">
                            {user.name}
                          </p>
                          {isSelf && (
                            <p className="text-xs text-primary">
                              Your account
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {user.email}
                    </td>

                    <td className="px-5 py-4 text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <select
                        aria-label={`Role for ${user.name}`}
                        className="rounded-xl border border-border bg-background px-3 py-2 capitalize outline-none focus:border-primary disabled:opacity-50"
                        value={user.role}
                        disabled={
                          isSelf || busyId !== null
                        }
                        onChange={(event) =>
                          setRoleChange({
                            user,
                            role: event.target.value as UserRole,
                          })
                        }
                      >
                        {roles.map((role) => (
                          <option
                            key={role}
                            value={role}
                          >
                            {role}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <p className="p-10 text-center text-muted-foreground">
              No registered users found.
            </p>
          )}
        </div>
      )}

      <div className="mt-5 flex items-center gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="size-4 text-primary" />
        Admins cannot change their own role.
      </div>

      {/* CHANGE ROLE CONFIRMATION */}

      {roleChange && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="change-role-title"
            aria-describedby="change-role-description"
            className="w-full max-w-md rounded-3xl border border-border bg-card p-7 shadow-2xl"
          >
            <h2
              id="change-role-title"
              className="text-xl font-bold"
            >
              Change User Role?
            </h2>

            <p
              id="change-role-description"
              className="mt-3 text-sm leading-7 text-muted-foreground"
            >
              Change{" "}
              <strong>{roleChange.user.name}</strong>{" "}
              from{" "}
              <strong>{roleChange.user.role}</strong>{" "}
              to{" "}
              <strong>{roleChange.role}</strong>?
            </p>

            <div className="mt-7 flex justify-end gap-3">
              <button
                type="button"
                disabled={busyId !== null}
                onClick={() => setRoleChange(null)}
                className="rounded-xl border border-border px-5 py-3 text-sm font-semibold disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={busyId !== null}
                onClick={() =>
                  void confirmRoleChange()
                }
                className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
              >
                {busyId
                  ? "Saving..."
                  : "Confirm Change"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

import { useState } from "react";

const ChallengeFormModal = ({
    isOpen,
    onClose,
    onSave,
    editingChallenge
}) => {
    const [title, setTitle] = useState(
        editingChallenge?.title || ""
    );

    const [description, setDescription] = useState(
        editingChallenge?.description || ""
    );

    const [duration, setDuration] = useState(
        editingChallenge?.duration || ""
    );

    if (!isOpen) {
        return null;
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        onSave({
            ...editingChallenge,
            title,
            description,
            duration
        });

        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">

            <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">

                <div className="flex items-center justify-between">

                    <h2 className="text-xl font-semibold text-[var(--color-slate)]">
                        {editingChallenge
                            ? "Edit Challenge"
                            : "Create Challenge"}
                    </h2>

                    <button
                        onClick={onClose}
                        className="text-xl text-[var(--color-muted)]"
                    >
                        ×
                    </button>

                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mt-5 space-y-4"
                >

                    <div>
                        <label className="text-sm font-medium">
                            Challenge Title
                        </label>

                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Description
                        </label>

                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="3"
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Duration
                        </label>

                        <input
                            type="text"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-3">

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg border border-gray-300 px-4 py-2"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-lg bg-[var(--color-eco)] px-5 py-2 text-white"
                        >
                            {editingChallenge
                                ? "Update Challenge"
                                : "Save Challenge"}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default ChallengeFormModal;
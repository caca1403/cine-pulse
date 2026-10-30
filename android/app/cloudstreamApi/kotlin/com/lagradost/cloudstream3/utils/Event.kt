package com.lagradost.cloudstream3.utils

// CINEPULSE KONAĞI SHIM (kullanıcı 2026-10-29): CloudStream Event<T> gözlemci sınıfının
// birebir imzalı sade hali (invoke + Observer ekle/çıkar).
class Event<T> {
    private val observers = mutableSetOf<(T) -> Unit>()

    val size: Int get() = observers.size

    operator fun plusAssign(observer: (T) -> Unit) {
        synchronized(observers) { observers.add(observer) }
    }

    operator fun minusAssign(observer: (T) -> Unit) {
        synchronized(observers) { observers.remove(observer) }
    }

    operator fun invoke(value: T) {
        synchronized(observers) { observers.toList() }.forEach {
            try { it(value) } catch (_: Exception) {}
        }
    }
}

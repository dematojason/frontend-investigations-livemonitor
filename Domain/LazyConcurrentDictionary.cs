using System;
using System.Collections.Concurrent;
using System.Threading;

namespace CpcLiveMonitor.Domain
{
	/// <summary>
	/// Combines <see cref="Lazy{T}"/> and <see cref="ConcurrentDictionary{TKey,TValue}"/>.
	/// Courtesy of Mike Larah's post at
	/// https://blogs.endjin.com/2015/10/using-lazy-and-concurrentdictionary-to-ensure-a-thread-safe-run-once-lazy-loaded-collection/
	/// </summary>
	/// <typeparam name="TKey"></typeparam>
	/// <typeparam name="TValue"></typeparam>
	public class LazyConcurrentDictionary<TKey, TValue>
	{
		private readonly ConcurrentDictionary<TKey, Lazy<TValue>> _concurrentDictionary;


		public LazyConcurrentDictionary()
		{
			_concurrentDictionary = new ConcurrentDictionary<TKey, Lazy<TValue>>();
		}

		public TValue GetOrAdd(TKey key, Func<TKey, TValue> valueFactory)
		{
			Lazy<TValue> result = _concurrentDictionary.GetOrAdd(key,
				k => new Lazy<TValue>(() => valueFactory(k), LazyThreadSafetyMode.ExecutionAndPublication));

			return result.Value;
		}
	}
}